import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseDB from "../../firebase";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { Trash2, QrCode } from "lucide-react";

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProductData, setNewProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8089/api/admin/shops/getshops/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shop details");
        }
        const data = await response.json();
        setShop(data);
        setLoading(false);

        const productResponse = await fetch(
          `http://localhost:8089/api/admin/products/getshopproducts/${id}`
        );
        if (!productResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productData = await productResponse.json();
        setProducts(productData);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shop?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8089/api/admin/shops/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete shop");
      }

      alert("Shop deleted successfully");
      navigate("/shops");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddProduct = () => {
    navigate(`/shop/${id}/addproduct`);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8089/api/admin/products/deleteproduct/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateProduct = async (productId) => {
    setUploading(true);

    try {
      let imageUrl = editProduct.imageUrl;

      if (newProductData.image instanceof File) {
        const uniqueImageName = `${Date.now()}-${newProductData.image.name}`;
        const storage = getStorage(firebaseDB);
        const storageRef = ref(storage, `images/${uniqueImageName}`);
        await uploadBytes(storageRef, newProductData.image);
        imageUrl = await getDownloadURL(storageRef);
        console.log("Updated Image URL:", imageUrl);
      }

      const updatedProductData = {
        name: newProductData.name,
        description: newProductData.description,
        price: newProductData.price,
        category: newProductData.category,
        imageUrl: imageUrl,
      };

      const response = await fetch(
        `http://localhost:8089/api/admin/products/updateproduct/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProductData),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update product: ${errorMessage}`);
      }

      const updatedProduct = await response.json();
      setProducts(
        products.map((product) =>
          product._id === productId ? updatedProduct : product
        )
      );
      setEditProduct(null);
      setNewProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
      alert("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setNewProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.imageUrl,
    });
  };

  const handleDownloadQR = async (product) => {
    try {
      const qrCodeUrl = await QRCode.toDataURL(product._id);

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Product: ${product.name}`, 10, 10);
      doc.text(`Description: ${product.description}`, 10, 20);
      doc.text(`Price: LKR ${product.price}`, 10, 30);
      doc.text(`Category: ${product.category}`, 10, 40);
      doc.addImage(qrCodeUrl, "PNG", 10, 50, 100, 100);
      doc.save(`${product.name}-QR.pdf`);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 ml-10">
        {loading ? (
          <p className="text-gray-600">Loading shop details...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : shop ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-start mb-6">
              <img
                src={shop.image}
                alt={shop.name}
                className="w-64 h-64 object-cover rounded-lg mr-6"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                  {shop.name}
                </h1>
                <p className="text-gray-700 mb-4">{shop.description}</p>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  Location:
                </h2>
                <p className="text-gray-700 mb-4">{shop.location}</p>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  Contact Information:
                </h2>
                <p className="text-gray-700">Phone: {shop.contactInfo.phone}</p>
                <p className="text-gray-700">Email: {shop.contactInfo.email}</p>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Shop
              </button>
              <button
                onClick={handleAddProduct}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Product
              </button>
            </div>

            <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-800">
              Products
            </h2>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                  <thead className="bg-gray-200 text-gray-600">
                    <tr>
                      <th className="py-2 px-4 text-left">Image</th>
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Description</th>
                      <th className="py-2 px-4 text-left">Price</th>
                      <th className="py-2 px-4 text-left">Category</th>
                      <th className="py-2 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="border-t border-gray-300"
                      >
                        <td className="py-2 px-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-2 px-4">{product.name}</td>
                        <td className="py-2 px-4">{product.description}</td>
                        <td className="py-2 px-4">LKR {product.price}</td>
                        <td className="py-2 px-4">{product.category}</td>
                        <td className="py-2 px-4 text-center">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadQR(product)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
                          >
                            <QrCode className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No products available.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Shop not found.</p>
        )}
      </div>

      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateProduct(editProduct._id);
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={newProductData.name}
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={newProductData.description}
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  value={newProductData.price}
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  value={newProductData.category}
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Image</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      image: e.target.files[0],
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                >
                  {uploading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDetail;

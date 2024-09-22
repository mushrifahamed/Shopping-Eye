import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseDB from '../../firebase'; // Import Firebase configuration
import QRCode from 'qrcode'; // Import QR code generation library
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProductData, setNewProductData] = useState({ name: '', description: '', price: '', category: '', image: null });
  const [uploading, setUploading] = useState(false); // State for handling image upload status

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8089/api/admin/shops/getshops/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shop details');
        }
        const data = await response.json();
        setShop(data);
        setLoading(false);

        // Fetch products for this shop
        const productResponse = await fetch(`http://localhost:8089/api/admin/products/getshopproducts/${id}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch products');
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

  // Function to handle shop deletion
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this shop?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8089/api/admin/shops/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete shop');
      }

      alert('Shop deleted successfully');
      navigate('/shops');
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to navigate to the add product page
  const handleAddProduct = () => {
    navigate(`/shop/${id}/addproduct`);
  };

  // Function to handle product deletion
  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8089/api/admin/products/deleteproduct/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product._id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle product update
  const handleUpdateProduct = async (productId) => {
    setUploading(true);

    try {
      let imageUrl = editProduct.imageUrl;

      // If a new image is selected, upload it to Firebase
      if (newProductData.image instanceof File) {
        const uniqueImageName = `${Date.now()}-${newProductData.image.name}`;
        const storage = getStorage(firebaseDB);
        const storageRef = ref(storage, `images/${uniqueImageName}`);
        await uploadBytes(storageRef, newProductData.image);
        imageUrl = await getDownloadURL(storageRef);
        console.log('Updated Image URL:', imageUrl);
      }

      const updatedProductData = {
        name: newProductData.name,
        description: newProductData.description,
        price: newProductData.price,
        category: newProductData.category,
        imageUrl: imageUrl,
      };

      const response = await fetch(`http://localhost:8089/api/admin/products/updateproduct/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      setProducts(products.map(product => product._id === productId ? updatedProduct : product));
      setEditProduct(null);
      setNewProductData({ name: '', description: '', price: '', category: '', image: null });
      alert('Product updated successfully');
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Function to generate QR code and download PDF
  const handleDownloadQR = async (product) => {
    try {
      const qrCodeUrl = await QRCode.toDataURL(product._id); // Use product ID instead of details
      
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Product: ${product.name}`, 10, 10);
      doc.text(`Description: ${product.description}`, 10, 20);
      doc.text(`Price: LKR ${product.price}`, 10, 30);
      doc.text(`Category: ${product.category}`, 10, 40);
      doc.addImage(qrCodeUrl, 'PNG', 10, 50, 100, 100);
      doc.save(`${product.name}-QR.pdf`);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('Failed to generate QR code. Please try again.');
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
              <img src={shop.image} alt={shop.name} className="w-64 h-64 object-cover rounded-lg mr-6" />
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">{shop.name}</h1>
                <p className="text-gray-700 mb-4">{shop.description}</p>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Location:</h2>
                <p className="text-gray-700 mb-4">{shop.location}</p>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">Contact Information:</h2>
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

            <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-800">Products</h2>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                  <thead className="bg-gray-200 text-gray-600">
                    <tr>
                      <th className="py-2 px-4 border-b">Image</th>
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Description</th>
                      <th className="py-2 px-4 border-b">Price</th>
                      <th className="py-2 px-4 border-b">Category</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td className="py-2 px-4 border-b">
                          <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover" />
                        </td>
                        <td className="py-2 px-4 border-b">{product.name}</td>
                        <td className="py-2 px-4 border-b">{product.description}</td>
                        <td className="py-2 px-4 border-b">LKR {product.price}</td>
                        <td className="py-2 px-4 border-b">{product.category}</td>
                        <td className="py-2 px-4 border-b space-x-2">
                          <button
                            onClick={() => setEditProduct(product)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleDownloadQR(product)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Download QR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No products found for this shop.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Shop details not available</p>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseDB from '../../firebase'; // Import Firebase configuration

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

  // Function to open edit modal
  const openEditModal = (product) => {
    setEditProduct(product);
    setNewProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: null, // Reset image to null for editing
    });
  };

  // Function to handle image change
  const handleImageChange = (e) => {
    setNewProductData({ ...newProductData, image: e.target.files[0] });
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
                    {products.map((product) => (
                      <tr key={product._id} className="border-b">
                        <td className="py-2 px-4 w-32">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded"
                          />
                        </td>
                        <td className="py-2 px-4 text-gray-800">{product.name}</td>
                        <td className="py-2 px-4 text-gray-600">{product.description}</td>
                        <td className="py-2 px-4 text-gray-900 font-semibold">LKR {product.price}</td>
                        <td className="py-2 px-4 text-gray-600">{product.category}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => openEditModal(product)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="ml-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
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

            {editProduct && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateProduct(editProduct._id);
                    }}
                  >
                    <div className="mb-4">
                      <label className="block text-gray-700">Name:</label>
                      <input
                        type="text"
                        value={newProductData.name}
                        onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Description:</label>
                      <textarea
                        value={newProductData.description}
                        onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Price:</label>
                      <input
                        type="number"
                        value={newProductData.price}
                        onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Category:</label>
                      <input
                        type="text"
                        value={newProductData.category}
                        onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Image:</label>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {uploading ? 'Updating...' : 'Update Product'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditProduct(null)}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No shop found.</p>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;

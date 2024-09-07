import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar'; // Import the Sidebar component

const ShopDetail = () => {
  const { id } = useParams(); // Get the shop ID from the URL
  const navigate = useNavigate(); // Use navigate to redirect after deletion or to add a product
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

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
      navigate('/shops'); // Redirect to the shops page after deletion
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to navigate to the add product page
  const handleAddProduct = () => {
    navigate(`/shop/${id}/addproduct`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 ml-10"> 
        {loading ? (
          <p className="text-gray-600">Loading shop details...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : shop ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-start mb-6">
              {/* Image */}
              <img src={shop.image} alt={shop.name} className="w-64 h-64 object-cover rounded-lg mr-6" />
              {/* Details */}
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

            {/* Buttons */}
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

            {/* Products Section */}
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
          <p className="text-gray-600">No shop found.</p>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;

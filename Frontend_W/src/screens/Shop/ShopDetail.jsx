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
      <div className="flex-1 p-6">
        {loading ? (
          <p>Loading shop details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : shop ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img src={shop.image} alt={shop.name} className="w-full h-64 object-cover mb-6 rounded" />
            <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
            <p className="text-gray-700 mb-4">{shop.description}</p>
            <h2 className="text-xl font-semibold mb-2">Location:</h2>
            <p className="text-gray-700 mb-4">{shop.location}</p>
            <h2 className="text-xl font-semibold mb-2">Contact Information:</h2>
            <p className="text-gray-700">Phone: {shop.contactInfo.phone}</p>
            <p className="text-gray-700">Email: {shop.contactInfo.email}</p>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete Shop
            </button>

            {/* Add Product Button */}
            <button
              onClick={handleAddProduct}
              className="mt-6 ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Product
            </button>

            {/* Products Section */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">Products</h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="bg-gray-200 p-4 rounded-lg shadow-md">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover mb-4 rounded"
                    />
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-700">{product.description}</p>
                    <p className="text-gray-900 font-semibold mt-2">${product.price}</p>
                    <p className="text-gray-600 mt-1">Category: {product.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products found for this shop.</p>
            )}
          </div>
        ) : (
          <p>No shop found.</p>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;

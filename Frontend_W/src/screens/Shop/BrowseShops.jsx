import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Sidebar from '../../components/SideBar'; // Import the Sidebar component

const BrowseShops = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('http://localhost:8089/api/admin/shops/getshops');
        if (!response.ok) {
          throw new Error('Failed to fetch shops');
        }
        const data = await response.json();
        setShops(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Filter shops based on search term
  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Browse Shops</h1>

          {/* Add Shop Button */}
          <button
            onClick={() => navigate('/addshop')}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Shop
          </button>
        </div>

        <input
          type="text"
          placeholder="Search for shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {loading ? (
          <p>Loading shops...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Image</th>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Description</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShops.map(shop => (
                  <tr key={shop._id} className="border-b">
                    <td className="py-2 px-4">
                      <img src={shop.image} alt={shop.name} className="w-16 h-16 object-cover" />
                    </td>
                    <td className="py-2 px-4">{shop.name}</td>
                    <td className="py-2 px-4">{shop.description}</td>
                    <td className="py-2 px-4">
                      <a
                        href={`/shop/${shop._id}`}
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        View Shop
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseShops;

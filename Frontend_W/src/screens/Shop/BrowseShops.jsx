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
      <div className="flex-1 p-6 ml-10"> {/* Adjusted margin-left for the sidebar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Browse Shops</h1>
          
          {/* Search input */}
          <input
            type="text"
            placeholder="Search for shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 px-4 py-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p>Loading shops...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white  border-gray-300 rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-gray-700">Image</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700">Name</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700">Description</th>
                  <th className="py-2 px-4 border-b text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShops.map(shop => (
                  <tr key={shop._id} className="border-b">
                    <td className="py-2 px-4">
                      <img src={shop.image} alt={shop.name} className="w-16 h-16 object-cover rounded-full" />
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

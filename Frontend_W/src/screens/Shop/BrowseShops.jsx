import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar'; // Import the Sidebar component

const BrowseShops = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('http://localhost:8089/api/shops/getshops');
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Browse Shops</h1>
          <input
            type="text"
            placeholder="Search for shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p>Loading shops...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredShops.map(shop => (
              <div key={shop._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={shop.image} alt={shop.name} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
                  <p className="text-gray-600">{shop.description}</p>
                  <a
                    href={`/shop/${shop._id}`}
                    className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View Shop
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseShops;

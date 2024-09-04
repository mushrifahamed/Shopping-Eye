import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideBar'; // Import the Sidebar component

// Sample data for shops (replace with API call data in real use case)
const sampleShops = [
  { id: 1, name: 'Shop One', description: 'A wonderful shop with a variety of items.', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Shop Two', description: 'An amazing shop with exclusive products.', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Shop Three', description: 'A fantastic shop for all your needs.', image: 'https://via.placeholder.com/150' },
  // Add more shops as needed
];

const BrowseShops = () => {
  const [shops, setShops] = useState(sampleShops);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Replace with actual API call to fetch shops
    // fetch('/api/shops')
    //   .then(response => response.json())
    //   .then(data => setShops(data))
    //   .catch(error => console.error('Error fetching shops:', error));
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={shop.image} alt={shop.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
                <p className="text-gray-600">{shop.description}</p>
                <a
                  href={`/shop/${shop.id}`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View Shop
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseShops;

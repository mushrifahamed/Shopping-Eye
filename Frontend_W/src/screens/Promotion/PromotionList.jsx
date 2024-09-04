import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PromotionTablePage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/promotion');
        setPromotions(response.data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Promotion List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 border-b">#</th>
              <th className="px-6 py-3 border-b">Title</th>
              <th className="px-6 py-3 border-b">Description</th>
              <th className="px-6 py-3 border-b">Start Date</th>
              <th className="px-6 py-3 border-b">End Date</th>
              <th className="px-6 py-3 border-b">Image</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {promotions.length > 0 ? (
              promotions.map((promo, index) => (
                <tr key={promo._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{index + 1}</td>
                  <td className="px-6 py-4 border-b">{promo.title}</td>
                  <td className="px-6 py-4 border-b">{promo.description}</td>
                  <td className="px-6 py-4 border-b">{new Date(promo.start_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 border-b">{new Date(promo.end_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 border-b">
                    {promo.image_url && (
                      <img
                        src={promo.image_url}
                        alt={promo.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No promotions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionTablePage;

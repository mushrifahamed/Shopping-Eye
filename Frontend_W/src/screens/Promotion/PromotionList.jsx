import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/SideBar';

const PromotionTablePage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:8089/api/promotion/listPromotions');
        setPromotions(response.data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this promotion?");
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8089/api/promotion/deletePromotion/${_id}`);
        setPromotions(promotions.filter(promo => promo._id !== _id));
        console.log('Promotion deleted successfully');
      } catch (error) {
        console.error('Error deleting promotion:', error);
      }
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="p-6 bg-gray-50 min-h-screen w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Promotion List</h2>
          <Link to={'../addPromotion'}>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Promotion
            </button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-left border-b">#</th>
                <th className="px-6 py-3 text-left border-b">ID</th>
                <th className="px-6 py-3 text-left border-b">Title</th>
                <th className="px-6 py-3 text-left border-b">Description</th>
                <th className="px-6 py-3 text-left border-b">Start Date</th>
                <th className="px-6 py-3 text-left border-b">End Date</th>
                <th className="px-6 py-3 text-left border-b">Percentage</th>
                <th className="px-6 py-3 text-left border-b">Image</th>
                <th className="px-6 py-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {promotions.length > 0 ? (
                promotions.map((promo, index) => (
                  <tr key={promo._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{index + 1}</td>
                    <td className="px-6 py-4 border-b">{promo.ID}</td>
                    <td className="px-6 py-4 border-b">{promo.title}</td>
                    <td className="px-6 py-4 border-b">{promo.description}</td>
                    <td className="px-6 py-4 border-b">
                      {new Date(promo.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {new Date(promo.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-12 py-4 border-b">
                      {promo.percentage ? `${promo.percentage}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {promo.image_url ? (
                        <img
                          src={promo.image_url}
                          alt={promo.title}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                          onClick={() => openModal(promo.image_url)}
                        />
                      ) : (
                        'No image'
                      )}
                    </td>
                    <td className="px-6 py-4 border-b">
  <div className="flex flex-col space-y-2">
    <Link to={`../UpdatePromotion/${promo._id}`}>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
      >
        Update
      </button>
    </Link>
    <button
      onClick={() => handleDelete(promo._id)}
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
    >
      Delete
    </button>
  </div>
</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No promotions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for expanded image */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={selectedImage} alt="Expanded Promotion" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionTablePage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import axios from 'axios';
import Sidebar from '../../components/SideBar';

const LoyaltyTablePage = () => {
  const [loyaltyList, setLoyaltyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoyaltyId, setSelectedLoyaltyId] = useState(null);
  const [points, setPoints] = useState('');
  const [redeemPoints, setRedeemPoints] = useState('');

  useEffect(() => {
    const fetchLoyaltyList = async () => {
      try {
        const response = await axios.get('http://localhost:8089/api/loyalty/listLoyalty');
        setLoyaltyList(response.data);
      } catch (error) {
        console.error('Error fetching loyalty accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyList();
  }, []);

  const handleAddPoints = async (id) => {
    try {
      await axios.put(`http://localhost:8089/api/loyalty/addPoints/${id}`, { points });
      setLoyaltyList(loyaltyList.map(item => item._id === id ? { ...item, points: item.points + parseInt(points) } : item));
      setPoints('');
      setSelectedLoyaltyId(null);
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const handleRedeemPoints = async (id) => {
    try {
      await axios.put(`http://localhost:8089/api/loyalty/redeemPoints/${id}`, { redeemPoints });
      setLoyaltyList(loyaltyList.map(item => item._id === id ? { ...item, points: item.points - parseInt(redeemPoints), redeemedPoints: item.redeemedPoints + parseInt(redeemPoints) } : item));
      setRedeemPoints('');
      setSelectedLoyaltyId(null);
    } catch (error) {
      console.error('Error redeeming points:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this loyalty account?");
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8089/api/loyalty/deleteLoyalty/${id}`);
        setLoyaltyList(loyaltyList.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting loyalty account:', error);
      }
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="p-6 bg-gray-50 min-h-screen w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Loyalty List</h2>
          <Link to="/AddLoyalty"> {/* Navigate to the add loyalty page */}
            <button
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Loyalty
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-left border-b">#</th>
                <th className="px-6 py-3 text-left border-b">ID</th>
                <th className="px-6 py-3 text-left border-b">Phone Number</th>
                <th className="px-6 py-3 text-left border-b">Points</th>
                <th className="px-6 py-3 text-left border-b">Redeemed Points</th>
                <th className="px-6 py-3 text-left border-b">Expiration Date</th>
                <th className="px-6 py-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {loyaltyList.map((loyalty, index) => (
                <tr key={loyalty._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{index + 1}</td>
                  <td className="px-6 py-4 border-b">{loyalty.ID}</td>
                  <td className="px-6 py-4 border-b">{loyalty.phoneNumber}</td>
                  <td className="px-6 py-4 border-b">{loyalty.points}</td>
                  <td className="px-6 py-4 border-b">{loyalty.redeemedPoints}</td>
                  <td className="px-6 py-4 border-b">{new Date(loyalty.expirationDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 border-b">
                    {selectedLoyaltyId === loyalty._id ? (
                      <div>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Add points"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            className="px-4 py-2 border rounded"
                          />
                          <button
                            onClick={() => handleAddPoints(loyalty._id)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <input
                            type="number"
                            placeholder="Redeem points"
                            value={redeemPoints}
                            onChange={(e) => setRedeemPoints(e.target.value)}
                            className="px-4 py-2 border rounded"
                          />
                          <button
                            onClick={() => handleRedeemPoints(loyalty._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                          >
                            Redeem
                          </button>
                        </div>
                        <button
                          onClick={() => setSelectedLoyaltyId(null)}
                          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setSelectedLoyaltyId(loyalty._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                          Add/Redeem Points
                        </button>
                        <button
                          onClick={() => handleDelete(loyalty._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyTablePage;

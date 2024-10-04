import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/SideBar';

const LoyaltyForm = () => {
  const navigate = useNavigate();
  const [loyaltyData, setLoyaltyData] = useState({
    userId: '',
    phoneNumber: '',
    points: 0,
    expirationDate: new Date(new Date().getFullYear(), 11, 31), // Set default expiration date to year-end
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8089/api/user/users'); // Update with your actual user listing endpoint
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!loyaltyData.userId) newErrors.userId = 'User is required';
    if (!loyaltyData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoyaltyData({
      ...loyaltyData,
      [name]: value,
      expirationDate: new Date(new Date().getFullYear(), 11, 31), // Ensure expiration date is always year-end
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8089/api/Loyalty/createLoyalty', {
          ...loyaltyData,
          expirationDate: loyaltyData.expirationDate.toISOString(), // Convert expiration date to ISO string before sending
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Loyalty account created:', response.data);
        navigate("/LoyaltyList"); // Navigate to your loyalty accounts list
      } catch (error) {
        if (error.response && error.response.data.message === 'Phone number already exists') {
          // Display error to the user
          setErrors({ phoneNumber: 'This phone number is already in use' });
        }else {
          console.error('Error creating loyalty account', error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900">Add Loyalty Points</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {loading && <p className="text-blue-500">Creating loyalty account...</p>}
            
            <div>
              <label htmlFor="userId" className="block text-lg font-medium text-gray-700">Select User</label>
              <select
                id="userId"
                name="userId"
                value={loyaltyData.userId}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">-- Select User --</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.fullName || "Unknown"} 
                  </option>
                ))}
              </select>
              {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={loyaltyData.phoneNumber}
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Phone Number"
                required
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Points</label>
              <input
                type="number"
                value={loyaltyData.points}
                readOnly
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Expiration Date</label>
              <input
                type="date"
                value={loyaltyData.expirationDate.toISOString().split('T')[0]} // Format the date correctly for the input
                readOnly
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyForm;

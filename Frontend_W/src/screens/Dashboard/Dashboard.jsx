import React from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar'; // Import the Sidebar component

const Dashboard = () => {
  const navigate = useNavigate();

  // Get user information from token
  const getUserFromToken = () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        // Decode token to get user info
        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded); // Log the decoded token
        return decoded;
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    }
    return null;
  };

  const user = getUserFromToken();

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('token'); // Remove token from cookies
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        <header className="bg-white shadow-md mb-6 p-4 rounded">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h1>
          </div>
        </header>

        <main className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">This is your dashboard where you can see all the information.</p>
          {/* Add more content or components here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

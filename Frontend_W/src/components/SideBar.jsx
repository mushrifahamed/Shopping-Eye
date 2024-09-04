import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('token'); // Remove token from cookies
    navigate('/login'); // Redirect to login page
  };

  return (
    <aside className="w-64 bg-blue-500 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/shops" className="block py-2 px-4 hover:bg-blue-600 rounded">
              Shops
            </Link>
          </li>
          <li>
            <Link to="#products" className="block py-2 px-4 hover:bg-blue-600 rounded">
              Products
            </Link>
          </li>
          <li>
            <Link to="#loyalty" className="block py-2 px-4 hover:bg-blue-600 rounded">
              Loyalty
            </Link>
          </li>
          <li>
            <Link to="#promotions" className="block py-2 px-4 hover:bg-blue-600 rounded">
              Promotions
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="block w-full mt-4 py-2 px-4 bg-red-500 hover:bg-red-600 rounded text-left"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

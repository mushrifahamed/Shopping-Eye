import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import bgSidebar from '../assets/bg-sidebar.jpg'

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null); // State to track the open menu
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      Cookies.remove('token'); // Remove token from cookies
      navigate('/login'); // Redirect to login page
    }
  };

  // Toggle menu item
  const handleMenuClick = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu); // Toggle the menu
  };

  // Helper function to check if a menu item is active
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="relative w-64 bg-white text-black p-6 m-5 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <button
              onClick={() => handleMenuClick('shops')}
              className={`block py-2 px-4 rounded w-full text-left hover:bg-blue-500 hover:text-white ${openMenu === 'shops' ? 'bg-blue-600 text-white' : ''}`}
            >
              <div className="flex items-center">
                <span>Shops</span>
              </div>
            </button>
            {openMenu === 'shops' && (
              <ul className="pl-6 mt-2">
                <li className="mb-2">
                  <Link
                    to="/shops"
                    className={`block py-2 px-4 rounded ${isActive('/shops') ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-blue-500 hover:text-white text-black'}`}
                  >
                    View Shops
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/addshop"
                    className={`block py-2 px-4 rounded ${isActive('/addshop') ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-blue-500 hover:text-white text-black'}`}
                  >
                    Add Shop
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <button
              onClick={() => handleMenuClick('loyalty')}
              className={`block py-2 px-4 rounded w-full text-left hover:bg-blue-500 hover:text-white ${openMenu === 'loyalty' ? 'bg-blue-600 text-white' : ''}`}
            >
              Loyalty
            </button>
            {openMenu === 'loyalty' && (
              <ul className="pl-6 mt-2">
                <li className="mb-2">
                  <Link
                    to="/loyalty"
                    className={`block py-2 px-4 rounded ${isActive('/loyalty') ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-blue-500 hover:text-white text-black'}`}
                  >
                    View Loyalty
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/addloyalty"
                    className={`block py-2 px-4 rounded ${isActive('/addloyalty') ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-blue-500 hover:text-white text-black'}`}
                  >
                    Add Loyalty
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <button
              onClick={() => handleMenuClick('promotions')}
              className={`block py-2 px-4 rounded w-full text-left hover:bg-blue-500 hover:text-white ${openMenu === 'promotions' ? 'bg-blue-600 text-white' : ''}`}
            >
              Promotions
            </button>
            {openMenu === 'promotions' && (
              <ul className="pl-6 mt-2">
                <li className="mb-2"> 
                  <Link
                    to="/PromotionList"
                    className={`block py-2 px-4 rounded ${isActive('/PromotionList') ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-blue-500 hover:text-white text-black'}`}
                  >
                    View Promotions
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/addpromotion"
                    className={`block py-2 px-4 rounded ${isActive('/addpromotion') ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-blue-500 hover:text-white text-black'}`}
                  >
                    Add Promotion
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <hr className="my-5 border-t border-gray-300" />
          <li className="mb-2">
            <button
              onClick={handleLogout}
              className="block w-full mt-4 py-2 px-4 text-white bg-red-500 hover:bg-red-700 rounded text-left hover:text-white"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 rounded-b-md shadow-md overflow-hidden">
        <img
          src={bgSidebar} // Use the imported image
          alt="Sidebar Decoration"
          className="w-full h-32 object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null); // State to track the open menu
  const navigate = useNavigate();
  const location = useLocation();

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('token'); // Remove token from cookies
    navigate('/login'); // Redirect to login page
  };

  // Toggle menu item
  const handleMenuClick = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu); // Toggle the menu
  };

  // Helper function to check if a menu item is active
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-primary text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        <ul>
          <li>
          <button
              onClick={() => handleMenuClick('shops')}
              className={`block py-2 px-4 rounded w-full text-left ${isActive('/shops') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
            >
              <div className="flex items-center">
                <ShoppingBagIcon className="w-6 h-6 mr-3" /> {/* Adjust size and margin */}
                <span>Shops</span>
              </div>
              </button>
            {openMenu === 'shops' && (
              <ul className="pl-6 mt-2">
                <li>
                  <Link
                    to="/shops"
                    className={`block py-2 px-4 rounded ${isActive('/shops') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
                  >
                    
                    View Shops
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addshop"
                    className={`block py-2 px-4 rounded ${isActive('/addshop') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
                  >
                    Add Shop
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => handleMenuClick('loyalty')}
              className={`block py-2 px-4 rounded w-full text-left ${isActive('/loyalty') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
            >
              Loyalty
            </button>
            {openMenu === 'loyalty' && (
              <ul className="pl-6 mt-2">
                <li>
                  <Link
                    to="/loyalty"
                    className={`block py-2 px-4 rounded ${isActive('/loyalty') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
                  >
                    View Loyalty
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addloyalty"
                    className={`block py-2 px-4 rounded ${isActive('/addloyalty') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
                  >
                    Add Loyalty
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => handleMenuClick('promotions')}
              className={`block py-2 px-4 rounded w-full text-left ${isActive('/PromotionList') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
            >
              Promotions
            </button>
            {openMenu === 'promotions' && (
              <ul className="pl-6 mt-2">
                <li>
                  <Link
                    to="/PromotionList"
                    className={`block py-2 px-4 rounded ${isActive('/PromotionList') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
                  >
                    View Promotions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/addpromotion"
                    className={`block py-2 px-4 rounded ${isActive('/addpromotion') ? 'bg-secondary-600' : 'hover:bg-secondary-500'}`}
                  >
                    Add Promotion
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="block w-full mt-4 py-2 px-4 bg-[#FF6F61] hover:bg-red-600 rounded text-left"
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

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import bgSidebar from "../assets/bg-sidebar.jpg";

// Importing icons from lucide-react
import {
  Store,
  Award,
  Tag,
  UserPlus,
  LogOut,
  Diamond,
  NotepadText,
} from "lucide-react";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      Cookies.remove("token");
      navigate("/login");
    }
  };

  const handleMenuClick = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="relative w-64 bg-white text-black p-6 m-5 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        <Link to="/dashboard">Dashboard</Link>
      </h2>
      <nav>
        <ul>
          <li className="mb-2">
            <button
              onClick={() => handleMenuClick("shops")}
              className={`block py-2 px-4 rounded w-full text-left hover:bg-blue-500 hover:text-white ${
                openMenu === "shops" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <div className="flex items-center">
                <Store className="mr-2" size={22} />
                <span>Shops</span>
              </div>
            </button>
            {openMenu === "shops" && (
              <ul className="pl-6 mt-2">
                <li className="mb-2">
                  <Link
                    to="/shops"
                    className={`block py-2 px-4 rounded ${
                      isActive("/shops")
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "hover:bg-blue-500 hover:text-white text-black"
                    }`}
                  >
                    <div className="flex items-center">
                      <Diamond size={14} className="mr-2" />
                      <span>View Shops</span>
                    </div>
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/addshop"
                    className={`block py-2 px-4 rounded ${
                      isActive("/addshop")
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "hover:bg-blue-500 hover:text-white text-black"
                    }`}
                  >
                    <div className="flex items-center">
                      <Diamond size={14} className="mr-2" />
                      Add Shop
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="mb-2">
            <button
              onClick={() => handleMenuClick("loyalty")}
              className={`block py-2 px-4 rounded w-full text-left hover:bg-blue-500 hover:text-white ${
                openMenu === "loyalty" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <div className="flex items-center">
                <Award className="mr-2" size={22} />
                <span>Loyalty</span>
              </div>
            </button>
            {openMenu === "loyalty" && (
              <ul className="pl-6 mt-2">
                <li className="mb-2">
                  <Link
                    to="/LoyaltyList"
                    className={`block py-2 px-4 rounded ${isActive('/LoyaltyList') ? 'bg-blue-600 text-white hover:bg-blue-500' : 'hover:bg-blue-500 hover:text-white text-black'}`}
                  >
                    <div className="flex items-center">
                      <Diamond size={14} className="mr-2" />
                      View Loyalty
                    </div>
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/addloyalty"
                    className={`block py-2 px-4 rounded ${
                      isActive("/addloyalty")
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "hover:bg-blue-500 hover:text-white text-black"
                    }`}
                  >
                    <div className="flex items-center">
                      <Diamond size={14} className="mr-2" />
                      Add Loyalty
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className="mb-2">
            <button
              onClick={() => handleMenuClick("reports")}
              className={`block py-2 px-4 rounded w-full text-left hover:bg-blue-500 hover:text-white ${
                openMenu === "reports" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <div className="flex items-center">
                <NotepadText className="mr-2" size={22} />{" "}
                {/* Changed to NotepadText icon */}
                <span>Reports</span>
              </div>
            </button>
            {openMenu === "reports" && (
              <ul className="pl-6 mt-2">
                <li className="mb-2">
                  <Link
                    to="/WishlistReport"
                    className={`block py-2 px-4 rounded ${
                      isActive("/WishlistReport")
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "hover:bg-blue-500 hover:text-white text-black"
                    }`}
                  >
                    <div className="flex items-center">
                      <Diamond size={14} className="mr-2" />
                      View Wishlist Report
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className="mb-2">
            <button
              onClick={() => handleMenuClick("promotions")}
              className={`block py-2 px-4 rounded w-full text-left hover:bg-blue-500 hover:text-white ${
                openMenu === "promotions" ? "bg-blue-600 text-white" : ""
              }`}
            >
              <div className="flex items-center">
                <Tag className="mr-2" size={22} />
                <span>Promotions</span>
              </div>
            </button>
            {openMenu === "promotions" && (
              <ul className="pl-6 mt-2">
                <li className="mb-2">
                  <Link
                    to="/PromotionList"
                    className={`block py-2 px-4 rounded ${
                      isActive("/PromotionList")
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "hover:bg-blue-500 hover:text-white text-black"
                    }`}
                  >
                    <div className="flex items-center">
                      <Diamond size={14} className="mr-2" />
                      View Promotions
                    </div>
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/addpromotion"
                    className={`block py-2 px-4 rounded ${
                      isActive("/addpromotion")
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "hover:bg-blue-500 hover:text-white text-black"
                    }`}
                  >
                    <div className="flex items-center">
                      <Diamond size={14} className="mr-2" />
                      Add Promotion
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <hr className="my-5 border-t border-gray-300" />
          <li className="mb-2">
            <Link
              to="/register"
              className={`block py-2 px-4 rounded flex items-center ${
                isActive("/register")
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "hover:bg-blue-500 hover:text-white text-black"
              }`}
            >
              <UserPlus className="mr-2" size={22} />
              <span>Register Admin</span>
            </Link>
          </li>
          <li className="mb-2">
            <button
              onClick={handleLogout}
              className="block w-full mt-4 py-2 px-4 text-white bg-red-500 hover:bg-red-700 rounded text-left flex items-center"
            >
              <LogOut className="mr-2" size={22} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 rounded-b-md shadow-md overflow-hidden">
        <img
          src={bgSidebar}
          alt="Sidebar Decoration"
          className="w-full h-32 object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </aside>
  );
};

export default Sidebar;

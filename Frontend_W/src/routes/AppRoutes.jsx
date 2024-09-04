// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Authentication
import Register from '../screens/Authentication/Register.jsx';
import Login from '../screens/Authentication/Login.jsx';

//Dashboard
import Dashboard from '../screens/Dashboard/Dashboard.jsx';
import Sidebar from '../components/SideBar.jsx';

//Shops
import Shops from '../screens/Shop/BrowseShops.jsx'
import AddShop from '../screens/Shop/AddShop.jsx';

//Loyalty
import AddLoyalty from '../screens/Loyalty/AddLoyalty.jsx';
import AddPromotion from '../screens/Promotion/AddPromotion.jsx';
import PromotionList from '../screens/Promotion/PromotionList.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* Register component */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Sidebar" element={<Sidebar />} />

        {/* Shops */}
        <Route path="/shops" element={<Shops />} />
        <Route path="/addshop" element={<AddShop />} />

        {/* loyalty component */}
        <Route path="/AddLoyalty" element={<AddLoyalty />} />

        {/* promotion component */}
        <Route path="/AddPromotion" element={<AddPromotion />} />
        
        {/* promotion component */}
        <Route path="/PromotionList" element={<PromotionList />} />


      </Routes>
    </Router>
  );
};

export default AppRoutes;

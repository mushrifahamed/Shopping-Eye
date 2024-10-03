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
import Shops from '../screens/Shop/BrowseShops.jsx';
import AddShop from '../screens/Shop/AddShop.jsx';
import ShopDetail from '../screens/Shop/ShopDetail.jsx';

//Products
import AddProduct from '../screens/Products/AddProduct.jsx';

//Loyalty
import AddLoyalty from '../screens/Loyalty/AddLoyalty.jsx';
import AddPromotion from '../screens/Promotion/AddPromotion.jsx';
import PromotionList from '../screens/Promotion/PromotionList.jsx';
import UpdatePromotion from '../screens/Promotion/UpdatePromotion.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* Register component */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Sidebar" element={<Sidebar />} />

        {/* Shops */}
        <Route path="/shops" element={<Shops />} />
        <Route path="/addshop" element={<AddShop />} />
        <Route path="/shop/:id" element={<ShopDetail />} />

        {/* Products */}
        <Route path="/shop/:id/AddProduct" element={<AddProduct />} />

        {/* loyalty component */}
        <Route path="/AddLoyalty" element={<AddLoyalty />} />

        {/* promotion component */}
        <Route path="/AddPromotion" element={<AddPromotion />} />
        
        {/* promotion component */}
        <Route path="/PromotionList" element={<PromotionList />} />

         {/* promotion component */}
         <Route path="/UpdatePromotion/:_id" element={<UpdatePromotion />} />


      </Routes>
    </Router>
  );
};

export default AppRoutes;

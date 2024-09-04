// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Authentication
import Register from '../screens/Authentication/Register.jsx';

<<<<<<< Updated upstream
//Loyalty
import AddLoyalty from '../screens/Loyalty/AddLoyalty.jsx';
import AddPromotion from '../screens/Promotion/AddPromotion.jsx';
import PromotionList from '../screens/Promotion/PromotionList.jsx';
=======

>>>>>>> Stashed changes

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* Register component */}
        <Route path="/register" element={<Register />} />

<<<<<<< Updated upstream
        {/* loyalty component */}
        <Route path="/AddLoyalty" element={<AddLoyalty />} />

        {/* promotion component */}
        <Route path="/AddPromotion" element={<AddPromotion />} />
        
        {/* promotion component */}
        <Route path="/PromotionList" element={<PromotionList />} />
=======
>>>>>>> Stashed changes


      </Routes>
    </Router>
  );
};

export default AppRoutes;

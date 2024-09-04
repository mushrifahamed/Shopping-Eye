// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Authentication
import Register from '../screens/Authentication/Register.jsx';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* Register component */}
        <Route path="/register" element={<Register />} />


      </Routes>
    </Router>
  );
};

export default AppRoutes;

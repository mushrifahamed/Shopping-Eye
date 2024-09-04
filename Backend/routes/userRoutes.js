// src/routes/userRoutes.js
import express from 'express';
import { registerAdminUser, getAdminUsers, loginAdmin } from '../controllers/userController.js'; 

const router = express.Router();

// POST /api/users/login - Log in user
router.post('/login', loginAdmin);

// Register a new user
router.post('/register', registerAdminUser);

// Get all users (optional, for testing purposes)
router.get('/view', getAdminUsers);

export default router;

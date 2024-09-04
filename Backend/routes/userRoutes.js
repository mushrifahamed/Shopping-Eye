// src/routes/userRoutes.js
import express from 'express';
import { registerAdminUser, getAdminUsers } from '../controllers/userController.js'; 

const router = express.Router();

// Register a new user
router.post('/register', registerAdminUser);

// Get all users (optional, for testing purposes)
router.get('/view', getAdminUsers);

export default router;

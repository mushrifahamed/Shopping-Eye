import express from 'express';
import { registerAdminUser, getAdminUsers, loginAdmin } from '../controllers/AdminUserController.js';

const router = express.Router();

// POST /api/users/login - Log in admin user
router.post('/login', loginAdmin);

// POST /api/users/register - Register a new admin user
router.post('/register', registerAdminUser);

// GET /api/users/view - Get all admin users
router.get('/view', getAdminUsers);

export default router;

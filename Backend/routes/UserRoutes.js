import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  resetPassword,
  getUserProfile
} from '../controllers/UserController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.post('/reset-password', resetPassword);
router.get('/profile', getUserProfile);

export default router;

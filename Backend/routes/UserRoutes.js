import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  resetPassword,
} from '../controllers/UserController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);
router.post('/reset-password', resetPassword);

export default router;

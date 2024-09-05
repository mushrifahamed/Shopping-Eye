import AdminUser from '../models/AdminUserModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Login admin user
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token with the user's details
    const token = jwt.sign(
      { aid: user.aid, email: user.email, type: user.type, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        aid: user.aid,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register a new admin user
export const registerAdminUser = async (req, res) => {
  const { aid, name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await AdminUser.findOne({ aid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new admin user with hashed password
    const newUser = new AdminUser({
      aid,
      name,
      email,
      password,
      type: 'admin',
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all admin users
export const getAdminUsers = async (req, res) => {
  try {
    // Find users with type 'admin'
    const adminUsers = await AdminUser.find({ type: 'admin' });
    res.json(adminUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

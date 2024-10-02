import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Use the JWT secret from the environment variable
const JWT_SECRET = process.env.JWT_SECRET_USER;

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = await User.create({
      fullName,
      email,
      password, // Save the hashed password
      role: 'user', // Set the role to 'user'
    });

    // Respond with user data (excluding password)
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Registration error:', error.message); // Log the error message for debugging
    res.status(500).json({ message: 'Server error', error: error.message }); // Include the error message in the response (optional for debugging)
  }
};


// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token, // Include token in response
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve all users (Admin only, implement appropriate authorization)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get user information based on token
export const getUserProfile = async (req, res) => {
  try {
    // Get token from headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token and extract user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Find the user by ID, exclude password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the user profile
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      favorites: user.favorites,
    });
  } catch (error) {
    console.error(error);
    // Check if the error is due to an expired token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    // Handle other errors (e.g., invalid token)
    return res.status(500).json({ message: 'Server error' });
  }
};

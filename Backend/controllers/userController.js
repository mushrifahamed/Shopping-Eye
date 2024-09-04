import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Login user
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Compare the provided password with the hashed password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ uid: user.uid, email: user.email, type: user.type }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expires in 1 hour
      });
  
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          uid: user.uid,
          name: user.name,
          email: user.email,
          type: user.type,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const registerAdminUser = async (req, res) => {
  const { uid, name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user with hashed password and type 'admin'
    const newUser = new User({
      uid,
      name,
      email,
      password, // Include the password
      type: 'admin' // Set type to 'admin'
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    // Find users with type 'admin'
    const adminUsers = await User.find({ type: 'admin' });
    res.json(adminUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

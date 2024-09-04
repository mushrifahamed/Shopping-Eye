import User from '../models/userModel.js';

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

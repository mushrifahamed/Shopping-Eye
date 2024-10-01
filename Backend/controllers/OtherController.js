// productController.js
import Product from '../models/productModel.js'; // Adjust the import path as needed
import Shop from '../models/shopModel.js';

// Function to get unique categories
export const getUniqueCategories = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    // Extract unique categories
    const uniqueCategories = [...new Set(products.map(product => product.category))];

    // Send response with unique categories
    res.status(200).json(uniqueCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllShops = async (req, res) => {
    try {
      const shops = await Shop.find().populate('products'); // Populate products if needed
      res.status(200).json(shops);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch shops' });
    }
  };
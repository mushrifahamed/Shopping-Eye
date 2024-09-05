import express from 'express';
import { addProduct, getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Add a new product
router.post('/addproduct', addProduct);

// Get all products
router.get('/products', getProducts);

// Get a specific product by ID
router.get('/products/:id', getProductById);

export default router;

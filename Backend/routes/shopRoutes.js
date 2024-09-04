import express from 'express';
import { addShop, getShops, getShopById } from '../controllers/shopController.js';

const router = express.Router();

// Add a new shop
router.post('/addshop', addShop);

// Get all shops
router.get('/shops', getShops);

// Get a specific shop by ID
router.get('/shops/:id', getShopById);

export default router;

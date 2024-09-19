import express from 'express';
import { addShop, getShops, getShopById, deleteShop, updateShop } from '../controllers/shopController.js';

const router = express.Router();



// Add a new shop
router.post('/addshop', addShop);

// Get all shops
router.get('/getshops', getShops);

// Get a specific shop by ID
router.get('/getshops/:id', getShopById);

// DELETE /api/admin/shops/:id - Delete a shop by ID
router.delete('/:id', deleteShop);

// Route to update a shop
router.put('/updateshop/:id', updateShop);


export default router;

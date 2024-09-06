import express from 'express';
import {
  createWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlistByUser,
} from '../controllers/wishListController.js';

const router = express.Router();

// Create a new wishlist for a user
router.post('/create', createWishlist);

// Add a product to a user's wishlist
router.post('/add', addProductToWishlist);

// Remove a product from a user's wishlist
router.post('/remove', removeProductFromWishlist);

// Get wishlist for a specific user
router.get('/:userId', getWishlistByUser);

export default router;

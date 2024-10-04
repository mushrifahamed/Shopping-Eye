import express from "express";
import {
  createWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlistByUser,
  getShopByProduct,
  updateProductNote,
  deleteProductNote,
  incrementWishlistCount,
  getMostWishedProductsInDateRange,
  getUsersWithMostWishlistItems,
} from "../controllers/wishListController.js";

const router = express.Router();

// Create a new wishlist for a user
router.post("/create", createWishlist);

// Add a product to a user's wishlist
router.post("/add", addProductToWishlist);

// Remove a product from a user's wishlist
router.post("/remove", removeProductFromWishlist);

// Update note for a product in the wishlist
router.post("/update-note", updateProductNote);

// Delete note for a product in the wishlist
router.post("/delete-note", deleteProductNote);

// Get wishlist for a specific user
router.get("/:userId", getWishlistByUser);
router.get("/shop-by-product/:productName", getShopByProduct);

router.post("/increment-wishlist", incrementWishlistCount);

// Get the most wished products in a date range
router.post("/most-wished-products", getMostWishedProductsInDateRange);

// Get users who added many items to their wishlist within a date range
router.post("/users-with-most-wishlist-items", getUsersWithMostWishlistItems);

export default router;

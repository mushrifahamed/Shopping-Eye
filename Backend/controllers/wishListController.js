import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js"; // Import the Product model
import mongoose from "mongoose";
import Shop from "../models/shopModel.js";

// Static user ID for testing
const staticUserId = "staticUser123";

// Create a new wishlist for the static user
export const createWishlist = async (req, res) => {
  try {
    const existingWishlist = await Wishlist.findOne({ user: staticUserId });

    if (existingWishlist) {
      return res
        .status(400)
        .json({ message: "Wishlist already exists for this user" });
    }

    const newWishlist = new Wishlist({
      user: staticUserId,
      products: [],
    });

    await newWishlist.save();
    res.status(201).json({
      message: "Wishlist created successfully",
      wishlist: newWishlist,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating wishlist" });
  }
};

// Add a product to the static user's wishlist
export const addProductToWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find the wishlist for the user
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [productId],
      });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    // Save the wishlist
    await wishlist.save();

    res.status(200).send({ message: "Product added to wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to add product to wishlist" });
  }
};

// Remove a product from the static user's wishlist
export const removeProductFromWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: staticUserId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (prodId) => prodId.toString() !== productId
    );

    await wishlist.save();

    res
      .status(200)
      .json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: "Error removing product from wishlist" });
  }
};

// Get wishlist for the static user
export const getWishlistByUser = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: staticUserId }).populate({
      path: "products",
      select: "name description price category imageUrl",
    });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Error retrieving wishlist:", error); // Log the error
    res.status(500).json({ error: "Error retrieving wishlist" });
  }
};

// Method to find the shop based on a product's attributes
export const getShopByProduct = async (req, res) => {
  const { productName } = req.params;

  try {
    // Fetch the product by its name (or any other identifier you choose)
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(product.name);
    // Fetch all shops
    const shops = await Shop.find().populate("products");

    // Compare each shop with the product (based on the name, category, or other attributes)
    const matchingShops = shops.filter((shop) => {
      return shop.products.some((p) => {
        // Compare the product IDs
        return p._id.toString() === product._id.toString(); // Adjust this based on your matching logic
      });
    });

    // Log or use the matchingShops array as needed
    console.log(matchingShops);

    // Check if any shop matches the criteria
    if (matchingShops.length === 0) {
      return res
        .status(404)
        .json({ message: "No shop found for this product" });
    }

    res.status(200).json(matchingShops);
    // Return the first matching shop (or all matching shops, depending on your use case)
  } catch (error) {
    console.error("Error fetching shop:", error);
    res.status(500).json({ message: "Error fetching shop" });
  }
};

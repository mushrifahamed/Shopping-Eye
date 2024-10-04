import Wishlist from "../models/wishlistModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";
import Shop from "../models/shopModel.js";
import User from "../models/UserModel.js";

// Create a new wishlist for the static user
// Create a new wishlist for the user
export const createWishlist = async (req, res) => {
  const { userId } = req.body; // Accept userId only

  try {
    const existingWishlist = await Wishlist.findOne({ user: userId });

    if (existingWishlist) {
      return res
        .status(400)
        .json({ message: "Wishlist already exists for this user" });
    }

    const newWishlist = new Wishlist({
      user: userId,
      products: [], // Initialize with an empty products array
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

export const addProductToWishlist = async (req, res) => {
  const { userId, productId, note = "" } = req.body; // Default note to an empty string if not provided

  console.log("Request Data:", req.body);

  try {
    // Validate ObjectId formats
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    console.log(wishlist);
    // Create new wishlist if not found
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] }); // Initialize products as an empty array
      await wishlist.save(); // Save the new wishlist
    }
    console.log(productId);
    // Check if the product already exists in the wishlist
    const productExists = wishlist.products.some((item) => {
      return item.productId === productId;
    });
    console.log(2);
    if (!productExists) {
      wishlist.products.push({ productId, note }); // Push the product with the note
      await wishlist.save();
      return res.status(200).send({ message: "Product added to wishlist" });
    } else {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return res.status(500).json({ error: "Failed to add product to wishlist" });
  }
};

// Remove a product from the static user's wishlist
export const removeProductFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (prod) => prod.productId.toString() !== productId
    );

    await wishlist.save();
    res
      .status(200)
      .json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: "Error removing product from wishlist" });
  }
};

// Update the note for a specific product in the wishlist
export const updateProductNote = async (req, res) => {
  const { userId, productId, note } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    console.log(wishlist);
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const productIndex = wishlist.products.findIndex(
      (prod) => prod.productId.toString() === productId
    );
    console.log(2);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    wishlist.products[productIndex].note = note; // Update the note
    await wishlist.save();

    res.status(200).json({ message: "Note updated", wishlist });
  } catch (error) {
    res.status(500).json({ error: "Error updating note" });
  }
};

// Delete the note for a specific product in the wishlist
export const deleteProductNote = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const productIndex = wishlist.products.findIndex(
      (prod) => prod.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    wishlist.products[productIndex].note = ""; // Clear the note
    await wishlist.save();

    res.status(200).json({ message: "Note deleted", wishlist });
  } catch (error) {
    res.status(500).json({ error: "Error deleting note" });
  }
};

// Get wishlist for the static user
export const getWishlistByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "products.productId", // Populate the product details
      select: "name description price category imageUrl",
    });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    res.status(500).json({ error: "Error retrieving wishlist" });
  }
};

// Method to find the shop based on a product's attributes
export const getShopByProduct = async (req, res) => {
  const { productName } = req.params;

  try {
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(product.name);
    const shops = await Shop.find().populate("products");

    const matchingShops = shops.filter((shop) => {
      return shop.products.some((p) => {
        return p._id.toString() === product._id.toString();
      });
    });

    console.log(matchingShops);

    if (matchingShops.length === 0) {
      return res
        .status(404)
        .json({ message: "No shop found for this product" });
    }

    res.status(200).json(matchingShops);
  } catch (error) {
    console.error("Error fetching shop:", error);
    res.status(500).json({ message: "Error fetching shop" });
  }
};

export const incrementWishlistCount = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.wishlistCount += 1; // Increment the count
    await product.save(); // Save the updated product

    res.status(200).json(product); // Respond with the updated product
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: error.message });
  }
};

// Controller method to get most wished products in a date range
export const getMostWishedProductsInDateRange = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    // Perform aggregation to count products in the wishlist within the given date range
    const result = await Wishlist.aggregate([
      // Step 1: Unwind the products array to work with individual products
      { $unwind: "$products" },

      // Step 2: Match products that are within the date range
      {
        $match: {
          "products.createdAt": {
            $gte: new Date(startDate), // startDate is inclusive
            $lte: new Date(endDate), // endDate is inclusive
          },
        },
      },

      // Step 3: Group by productId and count occurrences
      {
        $group: {
          _id: "$products.productId", // Group by productId
          count: { $sum: 1 }, // Count how many times the product appears
        },
      },

      // Step 4: Sort by count from most to least
      { $sort: { count: -1 } },

      // Step 5: Optionally, you can limit the number of results
      // { $limit: 10 } // Uncomment if you want to limit the number of products returned
    ]);

    // Return the sorted result
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching wishlist products" });
  }
};

// Controller method to get users who added many items to their wishlist within a date range
export const getUsersWithMostWishlistItems = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const result = await Wishlist.aggregate([
      // Step 1: Unwind the products array
      { $unwind: "$products" },

      // Step 2: Match products added within the specified date range
      {
        $match: {
          "products.createdAt": {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },

      // Step 3: Group by user and count the number of products added
      {
        $group: {
          _id: "$user", // Group by user ID
          totalItems: { $sum: 1 }, // Sum up the number of products added
        },
      },

      // Step 4: Sort users by the total number of items added in descending order
      { $sort: { totalItems: -1 } },

      // Step 5: Optionally, limit the number of users returned
      // { $limit: 10 } // Uncomment if you want to limit to top 10 users
    ]);

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Server error while fetching users with most wishlist items",
      });
  }
};

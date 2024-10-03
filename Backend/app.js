// src/app.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors package

// Routes
import AdminProdRoutes from "./routes/AdminProdRoutes.js";
import AdminUserRoutes from "./routes/AdminUserRoutes.js";
import ShopRoutes from "./routes/shopRoutes.js";
import productRoutes from "./routes/productRoute.js"; // Add product routes
import promotionRoutes from "./routes/promotionRoutes.js";
import WishlistRoutes from "./routes/wishListRoutes.js";
import OtherRoutes from "./routes/OtherRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import TapCountRoutes from "./routes/TapCountRoutes.js";
import LoyaltyRoutes from "./routes/LoyaltyRoutes.js";

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB using the connection string from environment variables
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes

//admin - aathif
app.use("/api/admin/users", AdminUserRoutes);
app.use("/api/admin/shops", ShopRoutes);
app.use("/api/admin/products", AdminProdRoutes);

//user
app.use("/api/products", productRoutes); // Add product routes
app.use("/api/promotion", promotionRoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/Loyalty", LoyaltyRoutes);

//other
app.use("/api/other", OtherRoutes);
app.use("/api/tapcount", TapCountRoutes);

export default app;

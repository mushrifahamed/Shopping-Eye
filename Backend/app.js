// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import AdminUserRoutes from './routes/AdminUserRoutes.js';
import ShopRoutes from './routes/shopRoutes.js';
import productRoutes from './routes/productRoute.js';  // Add product routes
import promotionRoutes from './routes/promotionRoutes.js'

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin/users', AdminUserRoutes);
app.use('/api/shops', ShopRoutes);
app.use('/api/products', productRoutes);  // Add product routes
//app.use('./api/promotion', promotionRoutes);

export default app;

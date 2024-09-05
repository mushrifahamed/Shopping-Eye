// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import userRoutes from './routes/userRoutes.js';
import ShopRoutes from './routes/shopRoutes.js';
import productRoutes from './routes/productRoute.js';  // Add product routes
<<<<<<< Updated upstream
import promotionRoutes from './routes/promotinRoutes.js'
=======
import promotionRoutes from './routes/promotionRoutes.js';
>>>>>>> Stashed changes

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
app.use('/api/users', userRoutes);
<<<<<<< Updated upstream
app.use('/api/shops', ShopRoutes);
=======
app.use('./api/shops', ShopRoutes)
>>>>>>> Stashed changes
app.use('/api/products', productRoutes);  // Add product routes
app.use('./api/shops', ShopRoutes);
app.use('./api/promotion', promotionRoutes);

export default app;

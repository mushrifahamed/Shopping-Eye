// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the cors package
import userRoutes from './routes/userRoutes.js';
import ShopRoutes from './routes/shopRoutes.js';

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
app.use('/api/shops', ShopRoutes);

export default app;

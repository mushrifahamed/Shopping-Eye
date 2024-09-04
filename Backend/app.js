// src/app.js
import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

export default app;

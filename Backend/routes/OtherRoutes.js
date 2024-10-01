// productRoutes.js
import express from 'express';
import { getUniqueCategories, getAllShops } from '../controllers/OtherController.js'; // Adjust the import path as needed

const router = express.Router();

// Route to get unique categories
router.get('/categories', getUniqueCategories);
router.get('/shops', getAllShops);


export default router;

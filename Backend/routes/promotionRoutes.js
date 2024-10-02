import express from 'express';
import { createPromotion,listPromotions,deletePromotion,getPromotionsByDateRange, updatePromotion, listPromotionById} from '../controllers/PromotionController.js';
const Router = express.Router();

// Route to create a new promotion
Router.post('/createPromotion', createPromotion);

// Route to list all promotions
Router.get('/listPromotions', listPromotions);

// Route to delete a specific promotion by ID
Router.delete('/deletePromotion/:_id', deletePromotion);

// Route to get a specific promotion by ID
Router.put('/updatePromotion/:_id', updatePromotion);

// Route to get a specific promotion by ID
Router.get('/listPromotionById/:_id', listPromotionById); // Added GET route



// Route to get a report or analytics on promotions (if applicable)
Router.get('/report', getPromotionsByDateRange);

// Add other routes as needed, e.g., for top promotions, restocking, etc.


export default Router


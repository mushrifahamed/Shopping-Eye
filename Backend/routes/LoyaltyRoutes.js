import express from 'express';
import { createLoyalty } from '../controllers/LoyaltyController.js';

const Router = express.Router();

// Route to create a new loyalty account
Router.post('/createLoyalty', createLoyalty);


export default Router;
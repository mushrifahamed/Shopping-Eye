import express from 'express';
import { 
  createLoyalty, 
  addPoints, 
  redeemPoints, 
  deleteLoyalty,
  listLoyalty ,
  getLoyaltyReport 
} from '../controllers/LoyaltyController.js';

const Router = express.Router();

// Route to create a new loyalty account
Router.post('/createLoyalty', createLoyalty);

// Route to add points to a loyalty account
Router.put('/addPoints/:id', addPoints);

// Route to redeem points from a loyalty account
Router.put('/redeemPoints/:id', redeemPoints);

// Route to delete a loyalty account
Router.delete('/deleteLoyalty/:id', deleteLoyalty);

// Route to list all loyalty accounts
Router.get('/listLoyalty', listLoyalty);

// Route to get loyalty report
Router.get('/report', getLoyaltyReport);

export default Router;

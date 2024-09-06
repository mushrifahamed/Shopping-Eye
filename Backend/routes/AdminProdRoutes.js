import express from 'express';
import { addProduct, getShopProducts } from '../controllers/AdminProdController.js';

const router = express.Router();

// Route to add a new product
router.post('/addproduct', addProduct);

router.get('/getshopproducts/:id', getShopProducts)

export default router;

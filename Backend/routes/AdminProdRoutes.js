import express from 'express';
import { addProduct, getShopProducts, updateProduct, deleteProduct } from '../controllers/AdminProdController.js';

const router = express.Router();

// Route to add a new product
router.post('/addproduct', addProduct);

router.get('/getshopproducts/:id', getShopProducts)

// Update product
router.put('/updateproduct/:id', updateProduct);

// Delete product
router.delete('/deleteproduct/:id', deleteProduct);


export default router;

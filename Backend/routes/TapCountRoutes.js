import express from 'express';
import { handleTapCount } from '../controllers/TapCountController.js'; // Adjust the path as necessary

const router = express.Router();

router.post('/handletap', handleTapCount); // Endpoint to handle tap count

export default router;

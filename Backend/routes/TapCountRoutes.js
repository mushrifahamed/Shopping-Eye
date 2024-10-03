import express from 'express';
import { handleTapCount, getTapCounts } from '../controllers/TapCountController.js'; // Adjust the path as necessary

const router = express.Router();

router.post('/handletap', handleTapCount); // Endpoint to handle tap count
router.get('/gettapcounts', getTapCounts);

export default router;

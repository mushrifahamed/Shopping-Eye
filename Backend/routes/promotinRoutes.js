import PromotionControllers from '../controllers/PromotionController';


// Route to create a new promotion
Router.post('/createPromotion', PromotionControllers.createPromotion);

// Route to list all promotions
Router.get('/', PromotionControllers.listPromotions);

// Route to delete a specific promotion by ID
Router.delete('/:id', PromotionControllers.deletePromotion);

// Route to get a specific promotion by ID
Router.get('/update/:id', PromotionControllers.getPromotionById);

// Route to update a specific promotion by ID


// Route to get a report or analytics on promotions (if applicable)
Router.get('/report', PromotionControllers.getPromotionReportByDateRange);

// Add other routes as needed, e.g., for top promotions, restocking, etc.

export default router;


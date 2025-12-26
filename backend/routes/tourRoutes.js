const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTourById);
router.get('/slug/:slug', tourController.getTourBySlug);

// Admin routes
router.post('/', authenticateAdmin, tourController.createTour);
router.put('/:id', authenticateAdmin, tourController.updateTour);
router.delete('/:id', authenticateAdmin, tourController.deleteTour);

module.exports = router;


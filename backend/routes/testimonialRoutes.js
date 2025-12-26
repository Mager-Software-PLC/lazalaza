const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', testimonialController.getTestimonials);
router.post('/', testimonialController.createTestimonial);

// Admin routes
router.get('/all', authenticateAdmin, testimonialController.getAllTestimonials);
router.put('/:id', authenticateAdmin, testimonialController.updateTestimonial);
router.delete('/:id', authenticateAdmin, testimonialController.deleteTestimonial);

module.exports = router;


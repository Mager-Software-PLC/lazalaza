const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateAdmin } = require('../middleware/auth');

// Public route
router.post('/', bookingController.createBooking);

// Admin routes
router.get('/', authenticateAdmin, bookingController.getAllBookings);
router.get('/:id', authenticateAdmin, bookingController.getBookingById);
router.put('/:id', authenticateAdmin, bookingController.updateBooking);
router.delete('/:id', authenticateAdmin, bookingController.deleteBooking);

module.exports = router;


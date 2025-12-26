const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateAdmin } = require('../middleware/auth');

// Public route
router.post('/', contactController.createContact);

// Admin routes
router.get('/', authenticateAdmin, contactController.getContacts);
router.put('/:id', authenticateAdmin, contactController.updateContact);
router.delete('/:id', authenticateAdmin, contactController.deleteContact);

module.exports = router;


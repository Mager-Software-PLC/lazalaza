const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', guideController.getGuides);

// Admin routes
router.get('/all', authenticateAdmin, guideController.getAllGuides);
router.get('/:id', guideController.getGuideById);
router.post('/', authenticateAdmin, guideController.createGuide);
router.put('/:id', authenticateAdmin, guideController.updateGuide);
router.delete('/:id', authenticateAdmin, guideController.deleteGuide);
router.put('/reorder', authenticateAdmin, guideController.reorderGuides);

module.exports = router;


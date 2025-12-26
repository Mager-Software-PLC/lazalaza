const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', achievementController.getAllAchievements);

// Admin routes
router.get('/admin', authenticateAdmin, achievementController.getAdminAchievements);
router.get('/:id', authenticateAdmin, achievementController.getAchievementById);
router.post('/', authenticateAdmin, achievementController.createAchievement);
router.put('/:id', authenticateAdmin, achievementController.updateAchievement);
router.delete('/:id', authenticateAdmin, achievementController.deleteAchievement);
router.put('/reorder', authenticateAdmin, achievementController.reorderAchievements);

module.exports = router;


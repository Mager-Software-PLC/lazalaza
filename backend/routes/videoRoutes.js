const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', videoController.getVideos);

// Admin routes
router.get('/all', authenticateAdmin, videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.post('/', authenticateAdmin, videoController.createVideo);
router.put('/:id', authenticateAdmin, videoController.updateVideo);
router.delete('/:id', authenticateAdmin, videoController.deleteVideo);
router.put('/reorder', authenticateAdmin, videoController.reorderVideos);

module.exports = router;


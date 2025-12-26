const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { authenticateAdmin } = require('../middleware/auth');

// Public routes
router.get('/', partnerController.getPartners);

// Admin routes
router.get('/all', authenticateAdmin, partnerController.getAllPartners);
router.get('/:id', partnerController.getPartnerById);
router.post('/', authenticateAdmin, partnerController.createPartner);
router.put('/:id', authenticateAdmin, partnerController.updatePartner);
router.delete('/:id', authenticateAdmin, partnerController.deletePartner);
router.put('/reorder', authenticateAdmin, partnerController.reorderPartners);

module.exports = router;


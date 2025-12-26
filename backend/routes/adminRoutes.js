const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

router.post('/register', authenticateAdmin, adminController.register); // Only existing admins can register
router.post('/login', adminController.login);
router.get('/profile', authenticateAdmin, adminController.getProfile);
router.get('/dashboard/stats', authenticateAdmin, adminController.getDashboardStats);
router.put('/change-password', authenticateAdmin, adminController.changePassword);
router.get('/admins', authenticateAdmin, adminController.getAllAdmins);
router.delete('/admins/:id', authenticateAdmin, adminController.deleteAdmin);

module.exports = router;


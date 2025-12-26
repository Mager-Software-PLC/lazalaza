const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cmsController');
const { authenticateAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determine uploads directory - use environment variable or default path
// For cPanel shared hosting, you can set UPLOADS_DIR in .env
let uploadsDir;
if (process.env.UPLOADS_DIR) {
  // Use absolute path from environment variable
  uploadsDir = process.env.UPLOADS_DIR;
} else {
  // Default: try relative path first, then try public_html/uploads for cPanel
  const defaultPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads');
  const cpanelPath = path.join(__dirname, '..', '..', '..', 'public_html', 'uploads');
  
  // Check if default path exists or can be created
  if (fs.existsSync(path.dirname(defaultPath)) || process.env.NODE_ENV !== 'production') {
    uploadsDir = defaultPath;
  } else if (fs.existsSync(path.dirname(cpanelPath))) {
    uploadsDir = cpanelPath;
  } else {
    // Fallback: use a directory relative to backend
    uploadsDir = path.join(__dirname, '..', 'uploads');
  }
}

// Create uploads directory if it doesn't exist
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
    console.log(`✅ Created uploads directory: ${uploadsDir}`);
  } else {
    console.log(`✅ Using uploads directory: ${uploadsDir}`);
  }
} catch (error) {
  console.error(`❌ Error creating uploads directory: ${error.message}`);
  console.error(`   Attempted path: ${uploadsDir}`);
  // Try fallback directory
  uploadsDir = path.join(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
      console.log(`✅ Created fallback uploads directory: ${uploadsDir}`);
    }
  } catch (fallbackError) {
    console.error(`❌ Error creating fallback directory: ${fallbackError.message}`);
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit (increased for videos)
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  },
});

// Public routes (for frontend to fetch content)
router.get('/settings', cmsController.getSettings);
router.get('/content', cmsController.getContent);
router.get('/colors', cmsController.getColors);
router.get('/features', cmsController.getFeatures);
router.get('/hero', cmsController.getHeroSettings);
router.get('/sections', cmsController.getSectionVisibility);
router.get('/section-styles', cmsController.getSectionStyles);
router.get('/section-styles/:key', cmsController.getSectionStyle);
router.get('/all', cmsController.getAllCMSData);

// Admin routes (require authentication)
router.put('/settings/:key', authenticateAdmin, cmsController.updateSetting);
router.put('/settings', authenticateAdmin, cmsController.updateMultipleSettings);
router.put('/content/:key', authenticateAdmin, cmsController.updateContent);
router.put('/content', authenticateAdmin, cmsController.updateMultipleContent);
router.put('/colors/:name', authenticateAdmin, cmsController.updateColor);
router.put('/colors', authenticateAdmin, cmsController.updateMultipleColors);
router.put('/features/:key', authenticateAdmin, cmsController.updateFeature);
router.put('/hero', authenticateAdmin, cmsController.updateHeroSettings);
router.put('/sections/:key', authenticateAdmin, cmsController.updateSectionVisibility);
router.put('/sections/reorder', authenticateAdmin, cmsController.reorderSections);
router.put('/section-styles/:key', authenticateAdmin, cmsController.updateSectionStyle);
router.post('/section-styles/:key/publish', authenticateAdmin, cmsController.publishSectionStyle);
router.post('/section-styles/publish-all', authenticateAdmin, cmsController.publishAllSectionStyles);

// Navbar routes
router.get('/navbar', cmsController.getNavbarItems); // Public - for frontend
router.get('/navbar/manage', authenticateAdmin, cmsController.getNavbarItems); // Admin - all items
router.post('/navbar', authenticateAdmin, cmsController.createNavbarItem);
router.put('/navbar/:id', authenticateAdmin, cmsController.updateNavbarItem);
router.delete('/navbar/:id', authenticateAdmin, cmsController.deleteNavbarItem);
router.put('/navbar/reorder', authenticateAdmin, cmsController.reorderNavbarItems);

// Media routes
router.get('/media', authenticateAdmin, cmsController.getMedia);

// Upload route
router.post('/media/upload', authenticateAdmin, upload.single('file'), cmsController.uploadMedia);

router.delete('/media/:id', authenticateAdmin, cmsController.deleteMedia);

// Gallery routes
router.get('/gallery', cmsController.getPublicGallery); // Public
router.get('/gallery/manage', authenticateAdmin, cmsController.getGallery); // Admin
router.post('/gallery', authenticateAdmin, cmsController.addToGallery);
router.delete('/gallery/:id', authenticateAdmin, cmsController.removeFromGallery);
router.put('/gallery/reorder', authenticateAdmin, cmsController.reorderGallery);

module.exports = router;


const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import models to sync
const Tour = require('./models/Tour');
const Itinerary = require('./models/Itinerary');
const Booking = require('./models/Booking');
const Testimonial = require('./models/Testimonial');
const Contact = require('./models/Contact');
const Admin = require('./models/Admin');
const TourAddon = require('./models/TourAddon');
const SiteSetting = require('./models/SiteSetting');
const SiteContent = require('./models/SiteContent');
const ThemeColor = require('./models/ThemeColor');
const MediaLibrary = require('./models/MediaLibrary');
const SiteFeature = require('./models/SiteFeature');
const HeroSetting = require('./models/HeroSetting');
const SectionVisibility = require('./models/SectionVisibility');
const GalleryItem = require('./models/GalleryItem');
const Guide = require('./models/Guide');
const Achievement = require('./models/Achievement');
const Video = require('./models/Video');
const Partner = require('./models/Partner');

// Set up associations
const models = { Tour, Booking, Itinerary, TourAddon, Testimonial, Contact, Admin };
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Import routes
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const guideRoutes = require('./routes/guideRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const videoRoutes = require('./routes/videoRoutes');
const partnerRoutes = require('./routes/partnerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'https://lazabusinessgroup.net',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CORS_ORIGIN
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));

// Minimal request logging (errors only)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cms', cmsRoutes);

// Serve uploaded files - use same logic as uploads directory
let staticUploadsDir;
if (process.env.UPLOADS_DIR) {
  staticUploadsDir = process.env.UPLOADS_DIR;
} else {
  const defaultPath = path.join(__dirname, '..', 'frontend', 'public', 'uploads');
  const cpanelPath = path.join(__dirname, '..', '..', 'public_html', 'uploads');
  
  if (fs.existsSync(defaultPath) || process.env.NODE_ENV !== 'production') {
    staticUploadsDir = defaultPath;
  } else if (fs.existsSync(cpanelPath)) {
    staticUploadsDir = cpanelPath;
  } else {
    staticUploadsDir = path.join(__dirname, 'uploads');
  }
}

// Only serve static files if directory exists
if (fs.existsSync(staticUploadsDir)) {
  app.use('/uploads', express.static(staticUploadsDir));
  console.log(`✅ Serving uploads from: ${staticUploadsDir}`);
} else {
  console.warn(`⚠️  Uploads directory not found: ${staticUploadsDir}`);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Laza International Media & Communications API is running' });
});

// Error handler
app.use(errorHandler);

// Database sync and server start
const startServer = async () => {
  try {
    await testConnection();
    
    // Sync models (set force: false in production)
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;


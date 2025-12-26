const Tour = require('../models/Tour');
const Itinerary = require('../models/Itinerary');
const TourAddon = require('../models/TourAddon');

// Helper function to parse JSON fields (some databases return JSON as strings)
const parseTourData = (Tour) => {
  const TourData = Tour.toJSON ? Tour.toJSON() : Tour;
  
  // Parse images if it's a string
  if (TourData.images) {
    if (typeof TourData.images === 'string') {
      try {
        TourData.images = JSON.parse(TourData.images);
      } catch (e) {
        console.warn('Failed to parse images JSON:', e);
        TourData.images = [];
      }
    }
    // Ensure it's an array
    if (!Array.isArray(TourData.images)) {
      TourData.images = [];
    }
  } else {
    TourData.images = [];
  }
  
  // Parse highlights if it's a string
  if (TourData.highlights) {
    if (typeof TourData.highlights === 'string') {
      try {
        TourData.highlights = JSON.parse(TourData.highlights);
      } catch (e) {
        console.warn('Failed to parse highlights JSON:', e);
        TourData.highlights = [];
      }
    }
    // Ensure it's an array
    if (!Array.isArray(TourData.highlights)) {
      TourData.highlights = [];
    }
  } else {
    TourData.highlights = [];
  }
  
  return TourData;
};

// Get all Tours
exports.getAllTours = async (req, res, next) => {
  try {
    const Tours = await Tour.findAll({
      order: [['created_at', 'DESC']],
    });
    const parsedTours = Tours.map(tour => parseTourData(tour));
    res.json(parsedTours);
  } catch (error) {
    next(error);
  }
};

// Get Tour by ID with itinerary and addons
exports.getTourById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const itinerary = await Itinerary.findAll({
      where: { Service_id: id },
      order: [['step_number', 'ASC']],
    });

    const addons = await TourAddon.findAll({
      where: { Service_id: id },
    });

    const TourData = parseTourData(tour);
    res.json({
      ...TourData,
      itinerary,
      addons,
    });
  } catch (error) {
    next(error);
  }
};

// Get Tour by slug
exports.getTourBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const tour = await Tour.findOne({ where: { slug } });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const itinerary = await Itinerary.findAll({
      where: { Service_id: tour.id },
      order: [['step_number', 'ASC']],
    });

    const addons = await TourAddon.findAll({
      where: { Service_id: tour.id },
    });

    const TourData = parseTourData(tour);
    res.json({
      ...TourData,
      itinerary,
      addons,
    });
  } catch (error) {
    next(error);
  }
};

// Create Tour (admin)
exports.createTour = async (req, res, next) => {
  try {
    const { itinerary, addons, ...TourData } = req.body;
    
    // Ensure slug is unique
    if (TourData.slug) {
      let baseSlug = TourData.slug.toLowerCase().trim();
      let uniqueSlug = baseSlug;
      let counter = 1;
      
      // Check if slug exists and append number if needed
      while (await Tour.findOne({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      TourData.slug = uniqueSlug;
    }
    
    const tour = await Tour.create(TourData);
    
    const TourDataParsed = parseTourData(tour);
    
    // Log saved Tour data
    console.log('✅ Tour created with images:', {
      TourId: tour.id,
      imageCount: TourDataParsed.images ? (Array.isArray(TourDataParsed.images) ? TourDataParsed.images.length : 'not array') : 'none',
      images: TourDataParsed.images
    });

    if (itinerary && Array.isArray(itinerary)) {
      await Itinerary.bulkCreate(
        itinerary.map((item) => ({ ...item, Service_id: tour.id }))
      );
    }

    if (addons && Array.isArray(addons)) {
      await TourAddon.bulkCreate(
        addons.map((item) => ({ ...item, Service_id: tour.id }))
      );
    }

    res.status(201).json(TourDataParsed);
  } catch (error) {
    next(error);
  }
};

// Update Tour (admin)
exports.updateTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itinerary, addons, ...TourData } = req.body;

    const tour = await Tour.findByPk(id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Ensure slug is unique (only if it's being changed)
    if (TourData.slug && TourData.slug !== tour.slug) {
      let baseSlug = TourData.slug.toLowerCase().trim();
      let uniqueSlug = baseSlug;
      let counter = 1;
      
      // Check if slug exists (excluding current tour)
      const { Op } = require('sequelize');
      while (await Tour.findOne({ where: { slug: uniqueSlug, id: { [Op.ne]: id } } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      TourData.slug = uniqueSlug;
    }

    await tour.update(TourData);
    
    // Reload to get updated data
    await tour.reload();
    
    const TourDataParsed = parseTourData(tour);
    
    // Log saved Tour data
    console.log('✅ Tour updated with images:', {
      TourId: tour.id,
      imageCount: TourDataParsed.images ? (Array.isArray(TourDataParsed.images) ? TourDataParsed.images.length : 'not array') : 'none',
      images: TourDataParsed.images
    });

    if (itinerary && Array.isArray(itinerary)) {
      await Itinerary.destroy({ where: { Service_id: id } });
      await Itinerary.bulkCreate(
        itinerary.map((item) => ({ ...item, Service_id: id }))
      );
    }

    if (addons && Array.isArray(addons)) {
      await TourAddon.destroy({ where: { Service_id: id } });
      await TourAddon.bulkCreate(
        addons.map((item) => ({ ...item, Service_id: id }))
      );
    }

    res.json(TourDataParsed);
  } catch (error) {
    next(error);
  }
};

// Delete Tour (admin)
exports.deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByPk(id);

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    await tour.destroy();
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    next(error);
  }
};


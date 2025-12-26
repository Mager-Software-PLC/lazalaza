const SiteSetting = require('../models/SiteSetting');
const SiteContent = require('../models/SiteContent');
const ThemeColor = require('../models/ThemeColor');
const MediaLibrary = require('../models/MediaLibrary');
const SiteFeature = require('../models/SiteFeature');
const HeroSetting = require('../models/HeroSetting');
const SectionVisibility = require('../models/SectionVisibility');
const SectionStyle = require('../models/SectionStyle');
const NavbarItem = require('../models/NavbarItem');
const GalleryItem = require('../models/GalleryItem');

// ============ Site Settings ============
exports.getSettings = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};
    const settings = await SiteSetting.findAll({ where, order: [['category', 'ASC'], ['setting_key', 'ASC']] });
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      let value = setting.setting_value;
      if (setting.setting_type === 'boolean') value = value === 'true';
      if (setting.setting_type === 'number') value = parseFloat(value);
      if (setting.setting_type === 'json') value = JSON.parse(value || '{}');
      settingsObj[setting.setting_key] = value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    next(error);
  }
};

exports.updateSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value, type, category, description } = req.body;
    
    const [setting, created] = await SiteSetting.findOrCreate({
      where: { setting_key: key },
      defaults: {
        setting_key: key,
        setting_value: String(value),
        setting_type: type || 'text',
        category: category || 'general',
        description,
      },
    });
    
    if (!created) {
      setting.setting_value = String(value);
      if (type) setting.setting_type = type;
      if (category) setting.category = category;
      if (description) setting.description = description;
      await setting.save();
    }
    
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

exports.updateMultipleSettings = async (req, res, next) => {
  try {
    const settings = req.body;
    const updates = [];
    
    for (const [key, value] of Object.entries(settings)) {
      const [setting] = await SiteSetting.findOrCreate({
        where: { setting_key: key },
        defaults: { setting_key: key, setting_value: String(value) },
      });
      setting.setting_value = String(value);
      updates.push(setting.save());
    }
    
    await Promise.all(updates);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ============ Site Content ============
exports.getContent = async (req, res, next) => {
  try {
    const { section, page, language } = req.query;
    const where = {};
    if (section) where.section = section;
    if (page) where.page = page;
    if (language) where.language = language || 'en';
    
    const content = await SiteContent.findAll({ where });
    
    const contentObj = {};
    content.forEach(item => {
      contentObj[item.content_key] = item.content_value;
    });
    
    res.json(contentObj);
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value, type, section, page, language } = req.body;
    
    const [content, created] = await SiteContent.findOrCreate({
      where: { content_key: key },
      defaults: {
        content_key: key,
        content_value: value,
        content_type: type || 'text',
        section,
        page,
        language: language || 'en',
      },
    });
    
    if (!created) {
      content.content_value = value;
      if (type) content.content_type = type;
      if (section) content.section = section;
      if (page) content.page = page;
      await content.save();
    }
    
    res.json(content);
  } catch (error) {
    next(error);
  }
};

exports.updateMultipleContent = async (req, res, next) => {
  try {
    const content = req.body;
    const updates = [];
    
    for (const [key, value] of Object.entries(content)) {
      const [item] = await SiteContent.findOrCreate({
        where: { content_key: key },
        defaults: { content_key: key, content_value: String(value) },
      });
      item.content_value = String(value);
      updates.push(item.save());
    }
    
    await Promise.all(updates);
    res.json({ message: 'Content updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ============ Theme Colors ============
exports.getColors = async (req, res, next) => {
  try {
    const colors = await ThemeColor.findAll({ order: [['color_category', 'ASC'], ['color_name', 'ASC']] });
    res.json(colors);
  } catch (error) {
    next(error);
  }
};

exports.updateColor = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { value, category } = req.body;
    
    const [color, created] = await ThemeColor.findOrCreate({
      where: { color_name: name },
      defaults: { color_name: name, color_value: value, color_category: category || 'primary' },
    });
    
    if (!created) {
      color.color_value = value;
      if (category) color.color_category = category;
      await color.save();
    }
    
    res.json(color);
  } catch (error) {
    next(error);
  }
};

exports.updateMultipleColors = async (req, res, next) => {
  try {
    const colors = req.body;
    const updates = [];
    
    for (const [name, value] of Object.entries(colors)) {
      const [color] = await ThemeColor.findOrCreate({
        where: { color_name: name },
        defaults: { color_name: name, color_value: value },
      });
      color.color_value = value;
      updates.push(color.save());
    }
    
    await Promise.all(updates);
    res.json({ message: 'Colors updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ============ Media Library ============
exports.getMedia = async (req, res, next) => {
  try {
    const { category, type } = req.query;
    const where = {};
    if (category) where.category = category;
    if (type) where.file_type = type;
    
    const media = await MediaLibrary.findAll({ where, order: [['created_at', 'DESC']] });
    res.json(media);
  } catch (error) {
    next(error);
  }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      console.error('❌ Upload failed: No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!req.admin || !req.admin.id) {
      console.error('❌ Upload failed: Admin not authenticated');
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    }
    
    // Verify file was actually saved
    const fs = require('fs');
    if (!fs.existsSync(file.path)) {
      console.error('❌ Upload failed: File was not saved to disk:', file.path);
      return res.status(500).json({ error: 'File upload failed: file was not saved' });
    }
    
    // Prepare media data
    const mediaData = {
      filename: file.filename,
      original_filename: file.originalname,
      file_path: `/uploads/${file.filename}`,
      file_type: file.mimetype,
      file_size: file.size,
      alt_text: req.body.alt_text || '',
      description: req.body.description || '',
      category: req.body.category || 'general',
      uploaded_by: null,
    };
    
    // Set uploaded_by if admin exists
    if (req.admin && req.admin.id) {
      try {
        const Admin = require('../models/Admin');
        const adminExists = await Admin.findByPk(req.admin.id);
        if (adminExists) {
          mediaData.uploaded_by = req.admin.id;
        }
      } catch (adminCheckError) {
        // Keep uploaded_by as null if admin check fails
      }
    }
    
    const media = await MediaLibrary.create(mediaData);
    res.status(201).json(media);
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    if (error.original) {
      console.error('   Original:', error.original.message);
    }
    
    // Check if response was already sent
    if (res.headersSent) {
      return next(error);
    }
    
    // Provide more specific error messages
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error: ' + (error.errors[0]?.message || 'Invalid data'),
        details: error.errors 
      });
    }
    
    // Handle SequelizeDatabaseError - check both name and original
    const isDatabaseError = error.name === 'SequelizeDatabaseError' || 
                            error.name === 'SequelizeConnectionError' ||
                            error.original?.code;
    
    if (isDatabaseError) {
      // Get the actual error message
      const errorMessage = error.original?.message || error.original?.sqlMessage || error.message || 'Database error occurred';
      
      console.error('Database Error Message:', errorMessage);
      
      // Provide more helpful error messages
      if (errorMessage.includes('Table') && (errorMessage.includes("doesn't exist") || errorMessage.includes('Unknown table'))) {
        return res.status(500).json({ 
          error: 'Database table not found. Please run the database migrations.',
          details: errorMessage
        });
      }
      if (errorMessage.includes('foreign key') || errorMessage.includes('FOREIGN KEY') || errorMessage.includes('Cannot add or update')) {
        return res.status(500).json({ 
          error: 'Database foreign key constraint failed. The admin user may not exist.',
          details: errorMessage
        });
      }
      if (errorMessage.includes('column') && (errorMessage.includes("doesn't exist") || errorMessage.includes('Unknown column'))) {
        return res.status(500).json({ 
          error: 'Database column missing. Please run the database migrations.',
          details: errorMessage
        });
      }
      
      // Return detailed error message - ALWAYS include the actual error
      return res.status(500).json({ 
        error: 'Database error: ' + errorMessage,
        details: errorMessage,
        type: error.name,
        originalError: error.original?.message || error.message
      });
    }
    
    // Handle other Sequelize errors
    if (error.name?.startsWith('Sequelize')) {
      const seqErrorMessage = error.original?.message || error.original?.sqlMessage || error.message || 'Unknown Sequelize error';
      return res.status(500).json({ 
        error: 'Database operation failed: ' + seqErrorMessage,
        details: seqErrorMessage,
        type: error.name,
        originalError: error.message
      });
    }
    
    // For ANY other error, return detailed message - never return generic message
    const anyErrorMessage = error.original?.message || error.message || 'Unknown error occurred';
    return res.status(500).json({
      error: anyErrorMessage,
      details: anyErrorMessage,
      type: error.name || 'Unknown',
      fullError: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await MediaLibrary.findByPk(id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // Delete file from filesystem (implement file deletion logic)
    await media.destroy();
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ============ Site Features ============
exports.getFeatures = async (req, res, next) => {
  try {
    const features = await SiteFeature.findAll({ order: [['feature_key', 'ASC']] });
    res.json(features);
  } catch (error) {
    next(error);
  }
};

exports.updateFeature = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { enabled, config } = req.body;
    
    const [feature] = await SiteFeature.findOrCreate({
      where: { feature_key: key },
      defaults: { feature_key: key, feature_name: key, enabled: enabled !== undefined ? enabled : true },
    });
    
    if (enabled !== undefined) feature.enabled = enabled;
    if (config) feature.feature_config = config;
    await feature.save();
    
    res.json(feature);
  } catch (error) {
    next(error);
  }
};

// ============ Hero Settings ============
exports.getHeroSettings = async (req, res, next) => {
  try {
    let hero = await HeroSetting.findByPk(1);
    if (!hero) {
      hero = await HeroSetting.create({});
    }
    res.json(hero);
  } catch (error) {
    next(error);
  }
};

exports.updateHeroSettings = async (req, res, next) => {
  try {
    let hero = await HeroSetting.findByPk(1);
    if (!hero) {
      hero = await HeroSetting.create(req.body);
    } else {
      await hero.update(req.body);
    }
    res.json(hero);
  } catch (error) {
    next(error);
  }
};

// ============ Section Visibility ============
exports.getSectionVisibility = async (req, res, next) => {
  try {
    const sections = await SectionVisibility.findAll({ order: [['order_index', 'ASC']] });
    
    // If no sections exist, initialize with defaults
    if (sections.length === 0) {
      const defaultSections = [
        { section_key: 'hero', section_name: 'Hero Section', visible: true, order_index: 0 },
        { section_key: 'about', section_name: 'About Section', visible: true, order_index: 1 },
        { section_key: 'videos', section_name: 'Videos Section', visible: true, order_index: 2 },
        { section_key: 'Services', section_name: 'Services Section', visible: true, order_index: 3 },
        { section_key: 'partners', section_name: 'Partners Section', visible: true, order_index: 4 },
        { section_key: 'stats', section_name: 'Stats/Achievements', visible: true, order_index: 5 },
        { section_key: 'testimonials', section_name: 'Testimonials', visible: true, order_index: 6 },
        { section_key: 'gallery', section_name: 'Gallery', visible: true, order_index: 7 },
        { section_key: 'contact', section_name: 'Contact Section', visible: true, order_index: 8 },
      ];
      
      await SectionVisibility.bulkCreate(defaultSections);
      const newSections = await SectionVisibility.findAll({ order: [['order_index', 'ASC']] });
      return res.json(newSections);
    }
    
    res.json(sections);
  } catch (error) {
    next(error);
  }
};

exports.updateSectionVisibility = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { visible, order_index } = req.body;
    
    const [section] = await SectionVisibility.findOrCreate({
      where: { section_key: key },
      defaults: { section_key: key, section_name: key, visible: visible !== undefined ? visible : true },
    });
    
    if (visible !== undefined) section.visible = visible;
    if (order_index !== undefined) section.order_index = order_index;
    await section.save();
    
    res.json(section);
  } catch (error) {
    next(error);
  }
};

exports.reorderSections = async (req, res, next) => {
  try {
    const { sections } = req.body; // Array of { section_key, order_index, visible }
    
    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: 'sections must be an array' });
    }
    
    await Promise.all(sections.map(({ section_key, order_index, visible, section_name }) => {
      return SectionVisibility.findOrCreate({
        where: { section_key },
        defaults: { 
          section_key, 
          section_name: section_name || section_key, 
          visible: visible !== undefined ? visible : true,
          order_index: order_index || 0
        },
      }).then(([section, created]) => {
        if (!created) {
          section.order_index = order_index;
          if (visible !== undefined) section.visible = visible;
          if (section_name) section.section_name = section_name;
        }
        return section.save();
      });
    }));
    
    res.json({ message: 'Sections reordered successfully' });
  } catch (error) {
    next(error);
  }
};

// ============ Gallery Management ============
exports.getGallery = async (req, res, next) => {
  try {
    const galleryItems = await GalleryItem.findAll({
      where: { is_active: true },
      order: [['order_index', 'ASC']],
    });
    
    // Manually join with media library
    const items = await Promise.all(galleryItems.map(async (item) => {
      const media = await MediaLibrary.findByPk(item.media_id);
      return {
        id: item.id,
        media_id: item.media_id,
        order_index: item.order_index,
        is_active: item.is_active,
        media: media,
      };
    }));
    
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Public endpoint for frontend
exports.getPublicGallery = async (req, res, next) => {
  try {
    const galleryItems = await GalleryItem.findAll({
      where: { is_active: true },
      order: [['order_index', 'ASC']],
    });
    
    const items = await Promise.all(galleryItems.map(async (item) => {
      const media = await MediaLibrary.findByPk(item.media_id);
      if (!media) return null;
      return {
        id: item.id,
        src: media.file_path,
        alt: media.alt_text || media.filename,
        description: media.description,
      };
    }));
    
    res.json(items.filter(item => item !== null));
  } catch (error) {
    next(error);
  }
};

exports.addToGallery = async (req, res, next) => {
  try {
    const { media_id } = req.body;
    
    if (!media_id) {
      return res.status(400).json({ error: 'media_id is required' });
    }
    
    const media = await MediaLibrary.findByPk(media_id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // Check if already in gallery
    const existing = await GalleryItem.findOne({ where: { media_id } });
    if (existing) {
      existing.is_active = true;
      await existing.save();
      return res.json(existing);
    }
    
    // Get max order_index
    const maxOrder = await GalleryItem.max('order_index') || 0;
    
    const galleryItem = await GalleryItem.create({
      media_id,
      order_index: maxOrder + 1,
      is_active: true,
    });
    
    res.status(201).json(galleryItem);
  } catch (error) {
    next(error);
  }
};

exports.removeFromGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const galleryItem = await GalleryItem.findByPk(id);
    
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    
    galleryItem.is_active = false;
    await galleryItem.save();
    
    res.json({ message: 'Removed from gallery successfully' });
  } catch (error) {
    next(error);
  }
};

exports.reorderGallery = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { id, order_index }
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array' });
    }
    
    await Promise.all(items.map(({ id, order_index }) => {
      return GalleryItem.update(
        { order_index },
        { where: { id } }
      );
    }));
    
    res.json({ message: 'Gallery reordered successfully' });
  } catch (error) {
    next(error);
  }
};

// ============ Section Styles ============
exports.getSectionStyles = async (req, res, next) => {
  try {
    const { published } = req.query;
    const where = {};
    
    // If published=true, only return published styles
    // If published=false or not set, return all styles (for admin)
    if (published === 'true') {
      where.is_published = true;
    }
    
    const styles = await SectionStyle.findAll({ where, order: [['section_key', 'ASC']] });
    res.json(styles);
  } catch (error) {
    next(error);
  }
};

exports.getSectionStyle = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { published } = req.query;
    
    const where = { section_key: key };
    if (published === 'true') {
      where.is_published = true;
    }
    
    let style = await SectionStyle.findOne({ where });
    
    // If not found and we want published, return null
    // Otherwise create default if not found
    if (!style && published !== 'true') {
      // Get section name from SectionVisibility
      const section = await SectionVisibility.findOne({ where: { section_key: key } });
      style = await SectionStyle.create({
        section_key: key,
        section_name: section ? section.section_name : key,
      });
    }
    
    res.json(style);
  } catch (error) {
    next(error);
  }
};

exports.updateSectionStyle = async (req, res, next) => {
  try {
    const { key } = req.params;
    const styleData = req.body;
    
    // Get section name if not provided
    if (!styleData.section_name) {
      const section = await SectionVisibility.findOne({ where: { section_key: key } });
      if (section) {
        styleData.section_name = section.section_name;
      } else {
        styleData.section_name = key;
      }
    }
    
    const [style, created] = await SectionStyle.findOrCreate({
      where: { section_key: key },
      defaults: {
        section_key: key,
        section_name: styleData.section_name || key,
        ...styleData,
      },
    });
    
    if (!created) {
      // Update all provided fields
      Object.keys(styleData).forEach(key => {
        if (styleData[key] !== undefined) {
          style[key] = styleData[key];
        }
      });
      await style.save();
    }
    
    res.json(style);
  } catch (error) {
    next(error);
  }
};

exports.publishSectionStyle = async (req, res, next) => {
  try {
    const { key } = req.params;
    
    const style = await SectionStyle.findOne({ where: { section_key: key } });
    if (!style) {
      return res.status(404).json({ error: 'Section style not found' });
    }
    
    style.is_published = true;
    await style.save();
    
    res.json({ message: 'Section style published successfully', style });
  } catch (error) {
    next(error);
  }
};

exports.publishAllSectionStyles = async (req, res, next) => {
  try {
    await SectionStyle.update(
      { is_published: true },
      { where: {} }
    );
    
    res.json({ message: 'All section styles published successfully' });
  } catch (error) {
    next(error);
  }
};

// ============ Get All CMS Data ============
exports.getAllCMSData = async (req, res, next) => {
  try {
    const [settings, content, colors, features, hero, sections, sectionStyles, navbarItems] = await Promise.all([
      SiteSetting.findAll(),
      SiteContent.findAll(),
      ThemeColor.findAll(),
      SiteFeature.findAll(),
      HeroSetting.findByPk(1).then(h => h || HeroSetting.create({})),
      SectionVisibility.findAll({ order: [['order_index', 'ASC']] }),
      SectionStyle.findAll({ where: { is_published: true } }),
      NavbarItem.findAll({ where: { is_active: true }, order: [['order_index', 'ASC']] }),
    ]);
    
    // Format settings
    const settingsObj = {};
    settings.forEach(s => {
      let value = s.setting_value;
      if (s.setting_type === 'boolean') value = value === 'true';
      if (s.setting_type === 'number') value = parseFloat(value);
      if (s.setting_type === 'json') value = JSON.parse(value || '{}');
      settingsObj[s.setting_key] = value;
    });
    
    // Format content
    const contentObj = {};
    content.forEach(c => {
      contentObj[c.content_key] = c.content_value;
    });
    
    // Format colors
    const colorsObj = {};
    colors.forEach(c => {
      colorsObj[c.color_name] = c.color_value;
    });
    
    // Format section styles
    const stylesObj = {};
    sectionStyles.forEach(s => {
      stylesObj[s.section_key] = s.toJSON();
    });
    
    // Format navbar items
    const navbarItemsArray = navbarItems.map(item => item.toJSON());
    
    res.json({
      settings: settingsObj,
      content: contentObj,
      colors: colorsObj,
      features: features,
      hero: hero,
      sections: sections,
      sectionStyles: stylesObj,
      navbarItems: navbarItemsArray,
    });
  } catch (error) {
    next(error);
  }
};

// ============ Navbar Items ============
exports.getNavbarItems = async (req, res, next) => {
  try {
    const { active } = req.query;
    const where = {};
    
    // If active=true, only return active items
    if (active === 'true') {
      where.is_active = true;
    }
    
    const items = await NavbarItem.findAll({ 
      where, 
      order: [['order_index', 'ASC']] 
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

exports.createNavbarItem = async (req, res, next) => {
  try {
    const { label, href, icon, order_index, is_active, is_external, target } = req.body;
    
    // Get max order_index if not provided
    let finalOrderIndex = order_index;
    if (finalOrderIndex === undefined || finalOrderIndex === null) {
      const maxOrder = await NavbarItem.max('order_index') || 0;
      finalOrderIndex = maxOrder + 1;
    }
    
    const item = await NavbarItem.create({
      label,
      href,
      icon: icon || null,
      order_index: finalOrderIndex,
      is_active: is_active !== undefined ? is_active : true,
      is_external: is_external || false,
      target: target || '_self',
    });
    
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

exports.updateNavbarItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const item = await NavbarItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Navbar item not found' });
    }
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        item[key] = updateData[key];
      }
    });
    
    await item.save();
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.deleteNavbarItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const item = await NavbarItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Navbar item not found' });
    }
    
    await item.destroy();
    res.json({ message: 'Navbar item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.reorderNavbarItems = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { id, order_index }
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array' });
    }
    
    await Promise.all(items.map(({ id, order_index }) => {
      return NavbarItem.update(
        { order_index },
        { where: { id } }
      );
    }));
    
    res.json({ message: 'Navbar items reordered successfully' });
  } catch (error) {
    next(error);
  }
};


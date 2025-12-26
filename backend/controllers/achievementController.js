const Achievement = require('../models/Achievement');

// Get all achievements (public - for frontend display)
exports.getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.findAll({
      where: { is_active: true },
      order: [['order_index', 'ASC']],
    });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

// Get all achievements (admin - includes inactive)
exports.getAdminAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.findAll({
      order: [['order_index', 'ASC']],
    });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

// Get achievement by ID
exports.getAchievementById = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    next(error);
  }
};

// Create achievement
exports.createAchievement = async (req, res, next) => {
  try {
    const { label, value, icon, gradient, order_index, is_active } = req.body;
    
    if (!label || value === undefined) {
      return res.status(400).json({ error: 'Label and value are required' });
    }

    const achievement = await Achievement.create({
      label,
      value: String(value),
      icon: icon || 'MapPin',
      gradient: gradient || 'from-primary-500 to-ocean-500',
      order_index: order_index !== undefined ? order_index : 0,
      is_active: is_active !== undefined ? is_active : true,
    });

    res.status(201).json(achievement);
  } catch (error) {
    next(error);
  }
};

// Update achievement
exports.updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const { label, value, icon, gradient, order_index, is_active } = req.body;

    if (label !== undefined) achievement.label = label;
    if (value !== undefined) achievement.value = String(value);
    if (icon !== undefined) achievement.icon = icon;
    if (gradient !== undefined) achievement.gradient = gradient;
    if (order_index !== undefined) achievement.order_index = order_index;
    if (is_active !== undefined) achievement.is_active = is_active;

    await achievement.save();
    res.json(achievement);
  } catch (error) {
    next(error);
  }
};

// Delete achievement
exports.deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    await achievement.destroy();
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Reorder achievements
exports.reorderAchievements = async (req, res, next) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    await Promise.all(
      items.map((item) =>
        Achievement.update(
          { order_index: item.order_index },
          { where: { id: item.id } }
        )
      )
    );

    const achievements = await Achievement.findAll({
      order: [['order_index', 'ASC']],
    });
    
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};


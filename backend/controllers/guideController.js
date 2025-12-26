const Guide = require('../models/Guide');

// Get all active guides (public)
exports.getGuides = async (req, res, next) => {
  try {
    const { active } = req.query;
    const where = active !== undefined ? { is_active: active === 'true' } : { is_active: true };

    const guides = await Guide.findAll({
      where,
      order: [['order_index', 'ASC'], ['created_at', 'DESC']],
    });
    res.json(guides);
  } catch (error) {
    next(error);
  }
};

// Get all guides (admin - includes inactive)
exports.getAllGuides = async (req, res, next) => {
  try {
    const guides = await Guide.findAll({
      order: [['order_index', 'ASC'], ['created_at', 'DESC']],
    });
    res.json(guides);
  } catch (error) {
    next(error);
  }
};

// Get guide by ID
exports.getGuideById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findByPk(id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    res.json(guide);
  } catch (error) {
    next(error);
  }
};

// Create guide (admin)
exports.createGuide = async (req, res, next) => {
  try {
    const guide = await Guide.create(req.body);
    res.status(201).json(guide);
  } catch (error) {
    next(error);
  }
};

// Update guide (admin)
exports.updateGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findByPk(id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    await guide.update(req.body);
    res.json(guide);
  } catch (error) {
    next(error);
  }
};

// Delete guide (admin)
exports.deleteGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findByPk(id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    await guide.destroy();
    res.json({ message: 'Guide deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Reorder guides (admin)
exports.reorderGuides = async (req, res, next) => {
  try {
    const { guides } = req.body; // Array of { id, order_index }

    const updates = guides.map(({ id, order_index }) =>
      Guide.update({ order_index }, { where: { id } })
    );

    await Promise.all(updates);
    res.json({ message: 'Guides reordered successfully' });
  } catch (error) {
    next(error);
  }
};


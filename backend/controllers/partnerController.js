const Partner = require('../models/Partner');

// Get all active partners (public)
exports.getPartners = async (req, res, next) => {
  try {
    const { active } = req.query;
    const where = active !== undefined ? { is_active: active === 'true' } : { is_active: true };

    const partners = await Partner.findAll({
      where,
      order: [['order_index', 'ASC'], ['created_at', 'DESC']],
    });
    res.json(partners);
  } catch (error) {
    next(error);
  }
};

// Get all partners (admin - includes inactive)
exports.getAllPartners = async (req, res, next) => {
  try {
    const partners = await Partner.findAll({
      order: [['order_index', 'ASC'], ['created_at', 'DESC']],
    });
    res.json(partners);
  } catch (error) {
    next(error);
  }
};

// Get partner by ID
exports.getPartnerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByPk(id);

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(partner);
  } catch (error) {
    next(error);
  }
};

// Create partner (admin)
exports.createPartner = async (req, res, next) => {
  try {
    const partner = await Partner.create(req.body);
    res.status(201).json(partner);
  } catch (error) {
    next(error);
  }
};

// Update partner (admin)
exports.updatePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByPk(id);

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    await partner.update(req.body);
    res.json(partner);
  } catch (error) {
    next(error);
  }
};

// Delete partner (admin)
exports.deletePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findByPk(id);

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    await partner.destroy();
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Reorder partners (admin)
exports.reorderPartners = async (req, res, next) => {
  try {
    const { partners } = req.body; // Array of { id, order_index }

    const updates = partners.map(({ id, order_index }) =>
      Partner.update({ order_index }, { where: { id } })
    );

    await Promise.all(updates);
    res.json({ message: 'Partners reordered successfully' });
  } catch (error) {
    next(error);
  }
};


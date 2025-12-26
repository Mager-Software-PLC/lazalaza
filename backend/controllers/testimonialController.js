const Testimonial = require('../models/Testimonial');

// Get all approved testimonials (public)
exports.getTestimonials = async (req, res, next) => {
  try {
    const { approved } = req.query;
    // If approved query param is provided and not empty, filter by it
    // Otherwise default to approved: true for public access
    let where = {};
    if (approved !== undefined && approved !== '') {
      where = { approved: approved === 'true' };
    } else {
      where = { approved: true };
    }

    const testimonials = await Testimonial.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// Get all testimonials (admin - includes both approved and unapproved)
exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// Create testimonial
exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create({
      ...req.body,
      approved: false, // Require admin approval
    });
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
};

// Update testimonial (admin)
exports.updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    await testimonial.update(req.body);
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

// Delete testimonial (admin)
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    await testimonial.destroy();
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};


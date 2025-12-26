const Contact = require('../models/Contact');

// Create contact message
exports.createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

// Get all contacts (admin)
exports.getContacts = async (req, res, next) => {
  try {
    const { replied } = req.query;
    const where = replied !== undefined ? { replied: replied === 'true' } : {};

    const contacts = await Contact.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

// Update contact (mark as replied) (admin)
exports.updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await contact.update(req.body);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

// Delete contact (admin)
exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await contact.destroy();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};


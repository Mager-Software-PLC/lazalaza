const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// Create booking
exports.createBooking = async (req, res, next) => {
  try {
    const { Service_id, guests, booking_date, ...bookingData } = req.body;

    // Get Tour price
    const tour = await Tour.findByPk(Service_id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const total_price = parseFloat(tour.price) * parseInt(guests);

    const booking = await Booking.create({
      ...bookingData,
      Service_id,
      guests,
      booking_date,
      total_price,
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Tour,
          attributes: ['id', 'title', 'slug'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Tour,
          attributes: ['id', 'title', 'slug', 'price'],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// Update booking status (admin)
exports.updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update(req.body);
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// Delete booking (admin)
exports.deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};


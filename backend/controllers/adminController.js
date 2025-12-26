const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Contact = require('../models/Contact');
const Testimonial = require('../models/Testimonial');

// Register admin
exports.register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      password_hash,
      email: email || null,
    });

    res.status(201).json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    next(error);
  }
};

// Get all admins
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.findAll({
      attributes: ['id', 'username', 'email', 'role', 'created_at'],
      order: [['created_at', 'DESC']],
    });
    res.json(admins);
  } catch (error) {
    next(error);
  }
};

// Delete admin
exports.deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentAdminId = req.admin.id;

    // Prevent self-deletion
    if (parseInt(id) === currentAdminId) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    await admin.destroy();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Login admin
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get admin profile
exports.getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: ['id', 'username', 'email', 'role', 'created_at'],
    });
    res.json(admin);
  } catch (error) {
    next(error);
  }
};

// Get dashboard analytics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [bookings, Tours, contacts, testimonials] = await Promise.all([
      Booking.findAll(),
      Tour.findAll(),
      Contact.findAll(),
      Testimonial.findAll({ where: { approved: true } }),
    ]);

    // Calculate revenue
    const totalRevenue = bookings.reduce((sum, b) => {
      return sum + (parseFloat(b.total_price) || 0);
    }, 0);

    // Booking status breakdown
    const bookingStatus = {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    // Revenue by month (last 6 months)
    const now = new Date();
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.created_at);
        return bookingDate.getMonth() === date.getMonth() && 
               bookingDate.getFullYear() === date.getFullYear();
      });
      const revenue = monthBookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);
      monthlyRevenue.push({ month: monthName, revenue });
    }

    // Bookings by month (last 6 months)
    const monthlyBookings = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const count = bookings.filter(b => {
        const bookingDate = new Date(b.created_at);
        return bookingDate.getMonth() === date.getMonth() && 
               bookingDate.getFullYear() === date.getFullYear();
      }).length;
      monthlyBookings.push({ month: monthName, count });
    }

    // Revenue by Tour
    const revenueByTour = {};
    bookings.forEach(booking => {
      const TourId = booking.Service_id;
      if (!revenueByTour[TourId]) {
        revenueByTour[TourId] = { Service_id: TourId, revenue: 0, count: 0 };
      }
      revenueByTour[TourId].revenue += parseFloat(booking.total_price) || 0;
      revenueByTour[TourId].count += 1;
    });

    const tourRevenueData = await Promise.all(
      Object.values(revenueByTour).map(async (data) => {
        const tour = await Tour.findByPk(data.Service_id);
        return {
          service: tour ? tour.title : 'Unknown',
          revenue: data.revenue,
          count: data.count,
        };
      })
    );

    // Recent bookings (last 10)
    const recentBookings = bookings
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10)
      .map(async (booking) => {
        const tour = await Tour.findByPk(booking.Service_id);
        return {
          id: booking.id,
          service: tour ? tour.title : 'Unknown',
          guest: booking.user_name,
          date: booking.booking_date,
          status: booking.status,
          revenue: parseFloat(booking.total_price) || 0,
        };
      });

    res.json({
      overview: {
        totalBookings: bookings.length,
        activeServices: Tours.length,
        totalRevenue,
        totalMessages: contacts.length,
        approvedTestimonials: testimonials.length,
      },
      bookingStatus,
      monthlyRevenue,
      monthlyBookings,
      serviceRevenue: tourRevenueData,
      recentBookings: await Promise.all(recentBookings),
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password if provided
    if (currentPassword) {
      const isValid = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
    }

    // Hash new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Update password
    await admin.update({ password_hash });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

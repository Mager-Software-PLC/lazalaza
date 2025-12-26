const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tour_id', // Map to the actual database column name
  },
  user_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(50),
  },
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  special_requests: {
    type: DataTypes.TEXT,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
});

// Associations
Booking.associate = (models) => {
  Booking.belongsTo(models.Tour, { foreignKey: 'Service_id' });
};

module.exports = Booking;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TourAddon = sequelize.define('TourAddon', {
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
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'Service_addons',
  timestamps: true,
  underscored: true,
});

module.exports = TourAddon;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Itinerary = sequelize.define('Itinerary', {
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
  step_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  step_title: {
    type: DataTypes.STRING(255),
  },
  step_text: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'itinerary',
  timestamps: true,
  underscored: true,
});

module.exports = Itinerary;


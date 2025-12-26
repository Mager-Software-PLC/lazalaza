const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  label: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'MapPin',
  },
  gradient: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'from-primary-500 to-ocean-500',
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'achievements',
  timestamps: true,
  underscored: true,
});

module.exports = Achievement;


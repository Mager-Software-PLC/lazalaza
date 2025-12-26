const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SiteSetting = sequelize.define('SiteSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  setting_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  setting_value: {
    type: DataTypes.TEXT,
  },
  setting_type: {
    type: DataTypes.ENUM('text', 'number', 'boolean', 'json', 'color', 'image'),
    defaultValue: 'text',
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'general',
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'site_settings',
  timestamps: true,
  underscored: true,
});

module.exports = SiteSetting;


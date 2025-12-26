const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const HeroSetting = sequelize.define('HeroSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.TEXT,
  },
  subtitle: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  primary_button_text: {
    type: DataTypes.STRING(100),
  },
  primary_button_link: {
    type: DataTypes.STRING(255),
  },
  secondary_button_text: {
    type: DataTypes.STRING(100),
  },
  secondary_button_link: {
    type: DataTypes.STRING(255),
  },
  background_video: {
    type: DataTypes.STRING(500),
  },
  background_image: {
    type: DataTypes.STRING(500),
  },
  overlay_opacity: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.40,
  },
}, {
  tableName: 'hero_settings',
  timestamps: true,
  underscored: true,
});

module.exports = HeroSetting;


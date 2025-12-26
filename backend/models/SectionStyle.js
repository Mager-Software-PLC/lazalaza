const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SectionStyle = sequelize.define('SectionStyle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  section_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  section_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // Background styles
  background_color: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  background_gradient: {
    type: DataTypes.TEXT,
    defaultValue: null, // JSON string for gradient config
  },
  background_image: {
    type: DataTypes.STRING(500),
    defaultValue: null,
  },
  background_overlay: {
    type: DataTypes.STRING(50),
    defaultValue: null, // rgba or hex for overlay
  },
  // Text styles
  text_color: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  heading_color: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  subheading_color: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  // Font styles
  font_family: {
    type: DataTypes.STRING(100),
    defaultValue: null,
  },
  heading_font: {
    type: DataTypes.STRING(100),
    defaultValue: null,
  },
  body_font: {
    type: DataTypes.STRING(100),
    defaultValue: null,
  },
  font_size_base: {
    type: DataTypes.STRING(20),
    defaultValue: null, // e.g., "16px", "1rem"
  },
  // Card styles
  card_background: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  card_border_color: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  card_border_radius: {
    type: DataTypes.STRING(20),
    defaultValue: null, // e.g., "8px", "0.5rem"
  },
  card_shadow: {
    type: DataTypes.STRING(100),
    defaultValue: null, // e.g., "0 4px 6px rgba(0,0,0,0.1)"
  },
  card_text_color: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  // Button styles (if section has buttons)
  button_background: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  button_text_color: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  button_hover_background: {
    type: DataTypes.STRING(50),
    defaultValue: null,
  },
  // Additional custom styles (JSON)
  custom_styles: {
    type: DataTypes.TEXT,
    defaultValue: null, // JSON string for additional CSS properties
  },
  // Published flag - styles are saved as draft until published
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'section_styles',
  timestamps: true,
  underscored: true,
});

module.exports = SectionStyle;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SiteContent = sequelize.define('SiteContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  content_value: {
    type: DataTypes.TEXT,
  },
  content_type: {
    type: DataTypes.ENUM('text', 'html', 'markdown'),
    defaultValue: 'text',
  },
  section: {
    type: DataTypes.STRING(50),
  },
  page: {
    type: DataTypes.STRING(50),
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'en',
  },
}, {
  tableName: 'site_content',
  timestamps: true,
  underscored: true,
});

module.exports = SiteContent;


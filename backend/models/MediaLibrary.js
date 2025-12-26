const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MediaLibrary = sequelize.define('MediaLibrary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  original_filename: {
    type: DataTypes.STRING(255),
  },
  file_path: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  file_type: {
    type: DataTypes.STRING(50),
  },
  file_size: {
    type: DataTypes.INTEGER,
  },
  alt_text: {
    type: DataTypes.STRING(255),
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING(50),
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'media_library',
  timestamps: true,
  underscored: true,
});

module.exports = MediaLibrary;


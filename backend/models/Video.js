const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  youtube_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
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
  tableName: 'videos',
  timestamps: true,
  underscored: true,
});

module.exports = Video;


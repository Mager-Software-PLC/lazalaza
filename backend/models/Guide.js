const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Guide = sequelize.define('Guide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING(500),
  },
  facebook_url: {
    type: DataTypes.STRING(500),
  },
  instagram_url: {
    type: DataTypes.STRING(500),
  },
  twitter_url: {
    type: DataTypes.STRING(500),
  },
  linkedin_url: {
    type: DataTypes.STRING(500),
  },
  youtube_url: {
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
  tableName: 'guides',
  timestamps: true,
  underscored: true,
});

module.exports = Guide;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GalleryItem = sequelize.define('GalleryItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  media_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'media_library',
      key: 'id',
    },
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
  tableName: 'gallery_items',
  timestamps: true,
  underscored: true,
});

module.exports = GalleryItem;


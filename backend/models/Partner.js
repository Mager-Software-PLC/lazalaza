const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Partner = sequelize.define('Partner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  logo_url: {
    type: DataTypes.STRING(500),
  },
  website_url: {
    type: DataTypes.STRING(500),
  },
  description: {
    type: DataTypes.TEXT,
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
  tableName: 'partners',
  timestamps: true,
  underscored: true,
});

module.exports = Partner;


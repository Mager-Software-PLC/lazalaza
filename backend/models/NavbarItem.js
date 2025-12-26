const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const NavbarItem = sequelize.define('NavbarItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  label: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  href: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING(100),
    defaultValue: null, // Icon name from lucide-react
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_external: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // If true, opens in new tab
  },
  target: {
    type: DataTypes.STRING(20),
    defaultValue: '_self', // '_self' or '_blank'
  },
}, {
  tableName: 'navbar_items',
  timestamps: true,
  underscored: true,
});

module.exports = NavbarItem;


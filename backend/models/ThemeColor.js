const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ThemeColor = sequelize.define('ThemeColor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  color_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  color_value: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  color_category: {
    type: DataTypes.STRING(50),
    defaultValue: 'primary',
  },
}, {
  tableName: 'theme_colors',
  timestamps: true,
  underscored: true,
});

module.exports = ThemeColor;


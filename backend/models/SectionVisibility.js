const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SectionVisibility = sequelize.define('SectionVisibility', {
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
  visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'section_visibility',
  timestamps: true,
  underscored: true,
});

module.exports = SectionVisibility;


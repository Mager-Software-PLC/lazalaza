const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
  },
  role: {
    type: DataTypes.ENUM('admin', 'super_admin'),
    defaultValue: 'admin',
  },
}, {
  tableName: 'admins',
  timestamps: true,
  underscored: true,
});

module.exports = Admin;


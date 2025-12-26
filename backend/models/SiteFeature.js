const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SiteFeature = sequelize.define('SiteFeature', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  feature_key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  feature_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  feature_config: {
    type: DataTypes.JSON,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'site_features',
  timestamps: true,
  underscored: true,
});

module.exports = SiteFeature;


const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Tour = sequelize.define('Tour', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  short_description: {
    type: DataTypes.STRING(500),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING(50),
  },
  group_size: {
    type: DataTypes.STRING(50),
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  highlights: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  tableName: 'tours',
  timestamps: true,
  underscored: true,
});

// Associations
Tour.associate = (models) => {
  Tour.hasMany(models.Booking, { foreignKey: 'Service_id' });
  Tour.hasMany(models.Itinerary, { foreignKey: 'Service_id' });
  Tour.hasMany(models.TourAddon, { foreignKey: 'Service_id' });
};

module.exports = Tour;


'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
    }
  }
  Brand.init({
    brand: DataTypes.STRING,
    type: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    coverUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Brand',
  });
  return Brand;
};
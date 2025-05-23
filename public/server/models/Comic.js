const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Comic = sequelize.define('Comic', {
  book: DataTypes.INTEGER,
  chapter: DataTypes.INTEGER,
  pageNumber: DataTypes.INTEGER,
  imageUrl: DataTypes.STRING,
});

module.exports = Comic;

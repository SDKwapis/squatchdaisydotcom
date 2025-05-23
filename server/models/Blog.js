const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Blog = sequelize.define('Blog', {
  title: DataTypes.STRING,
  date: DataTypes.STRING,
  content: DataTypes.TEXT,
});

module.exports = Blog;

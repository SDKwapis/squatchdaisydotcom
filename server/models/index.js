const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('squatchdaisy_db', 'postgres', 'squatch123', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;

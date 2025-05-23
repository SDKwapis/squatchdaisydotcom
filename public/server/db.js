const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('squatchdaisy_db', 'your_pg_username', 'your_pg_password', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;


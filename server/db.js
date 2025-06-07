require('dotenv').config();  // load .env in local/dev

const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // On Render (you’ve set DATABASE_URL in Env vars)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    // Internal Render DB doesn’t need SSL, 
    // but if you ever switch to External URL you can enable it:
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local development
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres'
    }
  );
}

module.exports = sequelize;




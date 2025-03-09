const Sequelize = require('sequelize');
const path = require('path');

// Define the database file path
const dbPath = path.resolve(__dirname, '..', 'data', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log, // Set to false to disable SQL query logging
});

module.exports = sequelize;
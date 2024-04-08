const Sequelize = require('sequelize');

const sequelize = new Sequelize('webdatabase', 'service', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
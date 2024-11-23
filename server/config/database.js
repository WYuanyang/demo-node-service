const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('videochat', 'root', 'your_password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize; 
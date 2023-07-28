const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Email = sequelize.define('Email', {
  isSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  retryCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Email;

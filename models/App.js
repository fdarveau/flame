const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const App = sequelize.define('App', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1  // Default value for database migration only
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'cancel'
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'apps'
});

module.exports = App;
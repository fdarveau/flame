const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Bookmark = sequelize.define('Bookmark', {
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
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: ''
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
  tableName: 'bookmarks'
});

module.exports = Bookmark;
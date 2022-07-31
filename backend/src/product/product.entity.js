require('module-alias/register')
const { DataTypes } = require('sequelize')
const sequelize = require('@src/database')

const Product = sequelize.define('Product', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: { 
    type: DataTypes.STRING,
    allowNull: false,
    // allowNull defaults to true
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
  }
})

module.exports = Product


const { Sequelize } = require('sequelize');
const {url_db} = require('@src/configuration')

const sequelize = new Sequelize(url_db, {
  dialect: 'postgres',
})
sequelize.sync()

module.exports = sequelize
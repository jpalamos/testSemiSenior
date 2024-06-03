const Sequelize = require('sequelize')
const config = require('../../../config/config');

const sequelize = new Sequelize(
  config.dbConfig.database,
  config.dbConfig.username,
  config.dbConfig.password,
  {
    host: config.dbConfig.host,
    dialect: config.dbConfig.dialect,
    port: config.dbConfig.port,
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    schema: config.dbConfig.schema,
    // timezone: config.dbConfig.timezone,
    // dialectOptions: { useUTC: config.dbConfig.useUTC },
  })

sequelize.sync(
  { alter: false }
)
  .then((sequelize) => {})
  .catch((err) => console.error(err))

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize
}

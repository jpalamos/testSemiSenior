const db = require('../database/database');
module.exports = {
  sequelize: db.sequelize,
  Sequelize: db.Sequelize
}

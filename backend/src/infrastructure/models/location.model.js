const db = require('../database/database');
const { User } = require('./auth.model');
const { Assistance } = require('./customer.model');

const location = db.sequelize.define('locations', {
  locationId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  location: { type: db.Sequelize.TEXT, allowNull: false },
  direccion: { type: db.Sequelize.TEXT, allowNull: false },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') }
}, {
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  },
});


const userLocation = db.sequelize.define('users_location', {
  idPersonalData: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    unique: 'userLocation',
    references: {
      model: 'users',
      key: 'userId',
    },
  },
  locationId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    unique: 'userLocation',
    references: {
      model: 'locations',
      key: 'locationId',
    },
  },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});
User.hasMany(userLocation, { foreignKey: 'userId' });
userLocation.belongsTo(User, { foreignKey: 'userId', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
userLocation.belongsTo(location, { foreignKey: 'locationId', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
Assistance.belongsTo(location, { foreignKey: 'locationId' });


module.exports = {
  Location: location,
  UserLocation: userLocation
}
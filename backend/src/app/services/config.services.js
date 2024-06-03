const { sequelize, Sequelize } = require('../../infrastructure/models/index');
const { UserRole, User, UserPersonalnfo, UserPicture } = require("../../infrastructure/models/auth.model")
const { Location } = require("../../infrastructure/models/location.model")

const getLocationsService = () => {
  return new Promise((resolve, reject) => {
    Location.findAll()
      .then((results) => resolve(results))
      .catch((err) => reject(err))
  })
}

const getMastersService = () => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      return await Promise.all([
        Location.findAll({ transaction: t }),
        UserRole.findAll({ transaction: t, where: { roleId: { [Sequelize.Op.gt]: 1 } } }),
        User.findAll({
          transaction: t, where: { roleId: 1 }, include: [
            { model: UserPersonalnfo, },
            { model: UserPicture, attributes: ['destination', 'filename'] },
          ],
        }),
      ])
    })
      .then(([locations, roles, admins]) => resolve({
        locations, roles, admins
      }))
      .catch((err) => reject(err))
  })
}

module.exports = {
  getLocationsService,
  getMastersService
}
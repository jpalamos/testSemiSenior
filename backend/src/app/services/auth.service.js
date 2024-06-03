const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { sequelize, Sequelize } = require('../../infrastructure/models/index');
const config = require('../../../config/config')
const { User, User_history_log, UserPersonalnfo, UserRole, UserPicture } = require('../../infrastructure/models/auth.model');
const { UserLocation } = require('../../infrastructure/models/location.model');
const { getPaginated } = require('./pagination');
const { deleteFile } = require('./fileSystem.service');


const login = (identityCard, password, ip) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const userResult = await User.findOne({
        raw: true,
        attributes: { include: ['password', 'userId', 'roleId', 'isActive'] },
        include: [
          { model: UserPicture, attributes: ['destination', 'filename'], },
          { model: UserPersonalnfo, where: { identityCard } }
        ],
        transaction: t,
      })
      if (!userResult || !bcrypt.compareSync(password, userResult.password)) {
        throw ({ auth: false, token: null, message: 'Usuario o contraseña inválido.' });
      } else if (userResult.isActive !== true) {
        throw ({ auth: false, token: null, message: 'Lo sentimos, este usuario está deshabilitado, por favor contacte al administrador.' });
      } else {
        const token = jwt.sign(
          {
            userId: userResult.userId, roleId: userResult.roleId,
            userPicture: {
              destination: userResult['user_picture.destination'],
              filename: userResult['user_picture.filename'],
            }
          },
          config.JWTSecret,
          { expiresIn: config.ExpiresIn }
        );
        await User_history_log.create(
          { userId: userResult.userId, ip },
          { transaction: t });
        await User.update(
          { token, updatedAt: Sequelize.fn('now') },
          {
            where: { userId: userResult.userId },
            transaction: t
          })
        return token;
      }
    })
      .then((token) => resolve(token))
      .catch((err) => reject(err));
  })
}

const registerService = ({ firstLastName, firstName, color, roleId, identityCard, location, password }, file) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) throw ({ message: 'bcryptFailGenSalt', err })
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) throw ({ message: 'bcryptFailHash', err })
        sequelize.transaction(async (t) => {
          const userFind = await User.findOne({
            include: [{ model: UserPersonalnfo, where: { identityCard }, }],
            raw: true,
            transaction: t
          })
          if (userFind) throw ({ message: 'La persona ya existe' })
          const user = await User.create({
            roleId,
            password: hash,
            isActive: true,
            token: ''
          }, { transaction: t });

          await UserPersonalnfo.create({
            userId: user.userId,
            identityCard,
            firstName,
            firstLastName,
            color,
          }, { transaction: t }
          );

          if (file) {
            await UserPicture.create(
              { ...file, userId: user.userId, },
              { transaction: t }
            )
          }

          await UserLocation.bulkCreate(
            location.map((locationId) => ({ userId: user.userId, locationId })),
            { transaction: t }
          );

          return { user: user.userId }
        })
          .then((token) => resolve(token))
          .catch((err) => reject(err));
      })
    })
  })
}

const registerEditService = (userId, { firstLastName, firstName, color, identityCard, location }, file) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const [userPicture, userLocation] = await Promise.all([
        UserPicture.findOne({
          where: { userId },
          raw: true,
          transaction: t
        }),
        UserLocation.findAll({
          where: { userId },
          raw: true,
          transaction: t
        })
      ]);

      const userPersonalInfo = await UserPersonalnfo.update({
        identityCard,
        firstName,
        firstLastName,
        color,
      }, { where: { userId }, transaction: t }
      );

      if (file) {
        if (userPicture?.filename) {
          UserPicture.update(
            file,
            { where: { userId }, transaction: t }
          )
        } else {
          await UserPicture.create(
            { ...file, userId },
            { transaction: t }
          )
        }
      }
      await UserLocation.destroy({
        where: {
          userId,
          locationId: userLocation
            .filter(({ locationId }) => !location.includes(locationId))
            .map(({ locationId }) => locationId)
        },
        transaction: t
      });

      await UserLocation.bulkCreate(
        location
          .filter((locationId) => !userLocation.map(({ locationId }) => locationId).includes(locationId))
          .map((locationId) => ({ userId, locationId })),
        { transaction: t }
      );

      return { userPicture, userPersonalInfo }
    })
      .then(({ userPersonalInfo, userPicture }) => {
        if (file && userPicture?.filename) {
          deleteFile('auth', userPicture?.filename);
        }
        resolve(userPersonalInfo)
      })
      .catch((err) => reject(err));
  })
}

const registerGetService = (page, limit, search) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const paginate = await getPaginated(User, +page, +limit,
        {
          include: [
            {
              model: UserPersonalnfo,
              ...search && {
                where: {
                  [Sequelize.Op.and]: search.split(' ').map((word) => ({
                    [Sequelize.Op.or]: [
                      { firstName: { [Sequelize.Op.iLike]: `%${word}%` } },
                      { firstLastName: { [Sequelize.Op.iLike]: `%${word}%` } },
                    ]
                  }))
                }
              },
            },
            { model: UserRole },
            { model: UserPicture, attributes: ['destination', 'filename'] },
          ],
          where: { roleId: { [Sequelize.Op.gt]: 1 } },
          order: [['userId', 'DESC']],
        },
        t)
      const { rows, ...restPaginate } = paginate;
      const locations = await UserLocation.findAll({
        where: { userId: rows.map((row) => row.userId) },
        transaction: t,
      })
      return {
        ...restPaginate,
        rows: rows.map((row) => ({
          ...row,
          users_locations: locations.filter((location) => location.userId === row.userId)
        })),
      }
    })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  })
}

const getTrainerService = () => {
  return new Promise((resolve, reject) => {
    User.findAll({
      where: { roleId: 3, },
      include: [
        { model: UserPersonalnfo, attributes: ['firstName', 'firstLastName', 'color'] },
        { model: UserPicture, attributes: ['destination', 'filename'] },
      ],
      attributes: ['isActive', 'userId']
    })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  })
}


module.exports = {
  login,
  registerService,
  registerEditService,
  registerGetService,
  getTrainerService
}

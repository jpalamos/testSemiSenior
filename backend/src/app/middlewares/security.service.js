const jwt = require('jsonwebtoken')
const config = require('../../../config/config')
const authModel = require('../../infrastructure/models/auth.model')

const checkToken = (req, res, next) => {
  let token = null;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }
  if (token) {
    jwt.verify(token, config.JWTSecret, function (err, decode) {
      if (err) return res.status(401).json({ ...err, message: 'Sin autorización' })
      authModel.User.findOne({
        where: { token, userId: decode.userId, isActive: true },
        raw: true,
        logging: false,
      })
        .then((user) => {
          if (!user) return res.status(401).json({ message: 'Sin autorización', err: 'user not found' })
          req['user'] = {
            userId: user.userId,
            roleId: user.roleId,
          }
          next()
        })
        .catch((err) => res.status(500).json({ err }))
    })
  } else {
    res.status(401).json({ message: 'Sin autorización' })
  }
}

const checkTokenSocket = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWTSecret, function (err, decoded) {
      if (err) reject(err);
      authModel.User.findOne({
        where: { token, userId: decoded.userId, isActive: true },
        raw: true,
        logging: false,
      })
        .then((user) => {
          if (!user) reject({ message: 'Sin autorización', err: 'user not found' })
          resolve(user);
        })
        .catch((err) => reject(err))
    })
  })
}

module.exports = {
  checkToken,
  checkTokenSocket
}

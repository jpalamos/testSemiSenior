const { User } = require('../../infrastructure/models/auth.model');
const { login, registerService, registerGetService, getTrainerService, registerEditService } = require('../services/auth.service');
const { deleteFile } = require('../services/fileSystem.service');

const loginController = (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    login(email, password, req.headers['x-real-ip'])
      .then((token) => res.status(202).json({ auth: true, token }))
      .catch((err) => {
        console.error(err);
        res.status(500).send(err)
      })
  } else {
    res.status(428).json({ message: 'InvalidParameterError' })
  }
}

const register = (req, res) => {
  const { files, body } = req;
  const { firstLastName, firstName, color, roleId, identityCard, location } = body.dataForm
    ? JSON.parse(req.body.dataForm)
    : body;

  if (firstName && firstLastName && identityCard && location && roleId) {
    registerService(
      { firstLastName, firstName, identityCard, color, location, roleId, password: '1234' },
      files && files.length > 0 ? files[0] : null
    )
      .then((register) => res.status(202).json(register))
      .catch((err) => {
        console.error(err);
        if (files.length > 0) {
          files.forEach((file) => {
            deleteFile('auth', file.filename)
          });
        }
        res.status(500).send(err);
      })
  } else {
    if (files.length > 0) {
      files.forEach((file) => {
        deleteFile('auth', file.filename)
      });
    }
    res.status(428).json({ message: 'InvalidParameterError' })
  }
}

const registerEdit = (req, res) => {
  const { files, body } = req;
  const { userId } = req.params;
  const { firstLastName, firstName, color, identityCard, location } = body.dataForm
    ? JSON.parse(req.body.dataForm)
    : body;

  if (firstName && firstLastName && identityCard && location) {
    registerEditService(
      userId,
      { firstLastName, firstName, identityCard, color, location, },
      files && files.length > 0 ? files[0] : null
    )
      .then((register) => res.status(202).json(register))
      .catch((err) => {
        console.error(err);
        if (files.length > 0) {
          files.forEach((file) => {
            deleteFile('auth', file.filename)
          });
        }
        res.status(500).send(err);
      })
  } else {
    if (files.length > 0) {
      files.forEach((file) => {
        deleteFile('auth', file.filename)
      });
    }
    res.status(428).json({ message: 'InvalidParameterError' })
  }
}

const getRegister = (req, res) => {
  const { page, limit, search } = req.query;
  registerGetService(page, limit, search)
    .then((register) => res.status(202).json(register))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const editRegister = (req, res) => {
  const { userId } = req.params
  const { comision, active, cel, password } = req.body;
  if (password) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return res.status(500).json({ message: 'bcryptFailGenSalt', err })
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return res.status(500).json({ message: 'bcryptFailHash', err })
        User.update(
          { comision, active, cel, password: hash, },
          { where: { userId: userId } }
        )
          .then((userRegister) => {
            res.status(201).json({ auth: true, userRegister })
          })
          .catch((err) => res.status(500).json({ message: 'updateUserFailtToken', err }));
      })
    })
  } else {
    User.update(
      { comision, active, cel },
      { where: { userId: userId } }
    )
      .then((userRegister) => {
        res.status(201).json({ auth: true, userRegister })
      })
      .catch((err) => res.status(500).json({ message: 'updateUserFailtToken', err }));
  }
}

const editPassword = (req, res) => {
  const { userId } = req.user;
  const { new1, old } = req.body;
  User.findOne({
    where: { active: true, userId },
    raw: true,
  })
    .then((userResult) => {
      if (!userResult || !bcrypt.compareSync(old, userResult.password)) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta' });
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) return res.status(500).json({ message: 'bcryptFailGenSalt', err })
          bcrypt.hash(new1, salt, function (err, hash) {
            if (err) return res.status(500).json({ message: 'bcryptFailHash', err })
            User.update(
              { password: hash },
              { where: { userId } }
            )
              .then((userRegister) => {
                res.status(201).json({ userRegister })
              })
              .catch((err) => res.status(500).json({ message: 'updateUserFailt', err }));
          })
        })
      }
    })
    .catch((err) => res.status(500).json({ message: 'updateUserFailtPassword', err }));
}

const getTrainers = (req, res) => {
  getTrainerService()
    .then((locations) => res.status(201).json(locations))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

module.exports = {
  loginController,
  register,
  registerEdit,
  editRegister,
  editPassword,
  getRegister,
  getTrainers
}

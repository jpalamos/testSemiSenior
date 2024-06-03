const db = require('../database/database');

const role = db.sequelize.define('user_roles', {
  roleId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  role: { type: db.Sequelize.TEXT, allowNull: false },
  description: { type: db.Sequelize.TEXT, allowNull: false },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') }
}, {
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  },
});

const user = db.sequelize.define('users', {
  userId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  roleId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'user_roles',
      key: 'roleId',
    },
  },
  // username: { type: db.Sequelize.TEXT, allowNull: false, unique: true },
  password: { type: db.Sequelize.TEXT, allowNull: false, },
  token: { type: db.Sequelize.TEXT, allowNull: false },
  isActive: { type: db.Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') }
}, {
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['password', 'token', 'createdAt', 'updatedAt'] }
  },
});

const userPersonalData = db.sequelize.define('users_personal_info', {
  idPersonalData: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: db.Sequelize.INTEGER,
    // unique: true,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'userId',
    },
  },
  email: { type: db.Sequelize.TEXT, allowNull: true, validate: { isEmail: true } },
  cel: { type: db.Sequelize.BIGINT, allowNull: true, },
  identityCard: { type: db.Sequelize.BIGINT, allowNull: false, unique: true },
  firstName: { type: db.Sequelize.TEXT, allowNull: false, },
  firstLastName: { type: db.Sequelize.TEXT, allowNull: false, },
  color: { type: db.Sequelize.TEXT, allowNull: true, },
}, {
  timestamps: false,
  freezeTableName: true
})

const userPicture = db.sequelize.define('user_pictures', {
  idFile: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'userId',
    },
  },
  originalname: { type: db.Sequelize.TEXT, allowNull: false, },
  destination: { type: db.Sequelize.TEXT, allowNull: false, },
  filename: { type: db.Sequelize.TEXT, allowNull: false },
  size: { type: db.Sequelize.INTEGER, allowNull: false, },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') }
}, {
  timestamps: false,
});

const user_history_log = db.sequelize.define('user_history_logs', {
  userHistoryId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId',
    },
  },
  ip: { type: db.Sequelize.TEXT, allowNull: true, validate: { isIP: true } },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});

user.hasOne(userPersonalData, { foreignKey: 'userId' });
user.hasOne(userPicture, { foreignKey: 'userId' });
user.hasOne(role, { foreignKey: 'roleId' });
user.belongsTo(role, { foreignKey: 'roleId', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
user_history_log.belongsTo(user, { foreignKey: 'userId', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
userPicture.belongsTo(user, { foreignKey: 'userId', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
userPersonalData.belongsTo(user, { foreignKey: 'userId', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });

module.exports = {
  UserRole: role,
  User: user,
  User_history_log: user_history_log,
  UserPersonalnfo: userPersonalData,
  UserPicture: userPicture
}

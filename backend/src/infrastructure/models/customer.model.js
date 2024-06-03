const db = require('../database/database');
const { User } = require('./auth.model');
const { Plan, Charge } = require('./billing.model');

const Customer = db.sequelize.define('customers', {
  customerId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: db.Sequelize.TEXT, allowNull: false },
  lastName: { type: db.Sequelize.TEXT, allowNull: false },
  identityCard: { type: db.Sequelize.BIGINT, allowNull: false, unique: true },
  email: { type: db.Sequelize.TEXT, allowNull: false, unique: true, validate: { isEmail: true } },
  phoneNumber: { type: db.Sequelize.TEXT },
  dateOfBirth: { type: db.Sequelize.DATEONLY },
  address: { type: db.Sequelize.TEXT },
  genderId: {
    type: db.Sequelize.INTEGER,
    references: {
      model: 'customer_genders',
      key: 'genderId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  sexualOrientationId: {
    type: db.Sequelize.INTEGER,
    references: {
      model: 'customer_sexualOrientations',
      key: 'sexualOrientationId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  planId: {
    allowNull: false,
    type: db.Sequelize.INTEGER,
    references: {
      model: 'billing_plans',
      key: 'planId',
    },
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  },
  emergencyContactName: { type: db.Sequelize.TEXT },
  emergencyContactPhone: { type: db.Sequelize.TEXT },
  membershipStatusId: {
    allowNull: false,
    type: db.Sequelize.INTEGER,
    references: {
      model: 'membership_statuses',
      key: 'membershipStatusId',
    },
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  },
  userId: {
    allowNull: false,
    type: db.Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'userId',
    },
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});

const Gender = db.sequelize.define('customer_genders', {
  genderId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  gender: { type: db.Sequelize.TEXT, allowNull: false },
});

const SexualOrientation = db.sequelize.define('customer_sexualOrientations', {
  sexualOrientationId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  orientation: { type: db.Sequelize.TEXT, allowNull: false },
});

const Assistance = db.sequelize.define('assistances', {
  assistanceId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'customerId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userId: {
    allowNull: false,
    type: db.Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'userId',
    },
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  },
  membershipStatusId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'membership_statuses',
      key: 'membershipStatusId',
    },
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  },
  locationId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'locations',
      key: 'locationId',
    },
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});

const CustomerPicture = db.sequelize.define('customer_pictures', {
  idFile: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'customers',
      key: 'customerId',
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

Customer.belongsTo(Gender, { foreignKey: 'genderId' });
Customer.belongsTo(SexualOrientation, { foreignKey: 'sexualOrientationId' });
Customer.belongsTo(Plan, { foreignKey: 'planId' });
Customer.belongsTo(User, { foreignKey: 'userId' });

Assistance.belongsTo(Customer, { foreignKey: 'customerId' });


Customer.hasOne(CustomerPicture, { foreignKey: 'customerId' });
CustomerPicture.belongsTo(Customer, { foreignKey: 'customerId' });

Charge.belongsTo(Customer, { foreignKey: 'customerId', onUpdate: 'RESTRICT', onDelete: 'RESTRICT', });

module.exports = {
  Customer,
  Gender,
  SexualOrientation,
  Assistance,
  CustomerPicture
}
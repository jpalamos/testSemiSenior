const db = require('../database/database');
const { User } = require('./auth.model');

const Plan = db.sequelize.define('billing_plans', {
  planId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  plan: { type: db.Sequelize.TEXT, allowNull: false },
  duration: { type: db.Sequelize.INTEGER, allowNull: false },
  durationType: {
    type: db.Sequelize.STRING, allowNull: false,
    validate: { isIn: [['year', 'mount', 'day', 'week']] },
  },
  amount: { type: db.Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') }
}, {
  timestamps: false,
});

const PaymentStatus = db.sequelize.define('billing_paymentStatus', {
  paymentStatusId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  statusName: { type: db.Sequelize.STRING, allowNull: false, unique: true },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});


const Charge = db.sequelize.define('billing_charges', {
  chargeId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: db.Sequelize.DECIMAL(10, 2), allowNull: false },
  paymentStatusId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'billing_paymentStatuses',
      key: 'paymentStatusId',
    },
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
  customerId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'customerId',
    },
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
  paymentCompletedAt: { type: db.Sequelize.DATEONLY, allowNull: false },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});

Charge.belongsTo(PaymentStatus, { foreignKey: 'paymentStatusId', onUpdate: 'RESTRICT', onDelete: 'RESTRICT', });
Charge.belongsTo(User, { foreignKey: 'userId', });
Charge.belongsTo(Plan, { foreignKey: 'planId', });

PaymentStatus.hasOne(Charge, { foreignKey: 'paymentStatusId' });

module.exports = {
  Plan,
  Charge,
  PaymentStatus,
}
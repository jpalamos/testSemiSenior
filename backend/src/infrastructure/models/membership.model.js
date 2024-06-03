
const db = require('../database/database');
const { Plan } = require('./billing.model');
const { Customer, Assistance } = require('./customer.model');

const MembershipStatus = db.sequelize.define('membership_status', {
  membershipStatusId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  statusName: { type: db.Sequelize.STRING, allowNull: false, unique: true },
}, {
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  },
});

const MembershipHistory = db.sequelize.define('membership_history', {
  historyId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
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
  membershipStatusId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'membership_statuses',
      key: 'membershipStatusId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
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
}, {
  timestamps: false,
});


MembershipHistory.belongsTo(MembershipStatus, { foreignKey: 'membershipStatusId' });
MembershipHistory.belongsTo(Plan, { foreignKey: 'planId' });
Customer.belongsTo(MembershipStatus, { foreignKey: 'membershipStatusId' });
Assistance.belongsTo(MembershipStatus, { foreignKey: 'membershipStatusId' });

module.exports = {
  MembershipStatus,
  MembershipHistory
}
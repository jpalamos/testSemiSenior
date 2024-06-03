const db = require('../database/database');
const { User } = require('./auth.model');

const Assessment = db.sequelize.define('assessments', {
  assessmentId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  attentionDate: { type: db.Sequelize.DATEONLY, allowNull: false, },
  weight: { type: db.Sequelize.FLOAT, allowNull: true, },
  height: { type: db.Sequelize.FLOAT, allowNull: true, },
  BMI: { type: db.Sequelize.FLOAT, allowNull: true, },
  body_fat_percentage: { type: db.Sequelize.FLOAT, allowNull: true, },
  viceral_fat: { type: db.Sequelize.FLOAT, allowNull: true, },
  esquel_muscle_percentage: { type: db.Sequelize.FLOAT, allowNull: true, },
  systole: { type: db.Sequelize.FLOAT, allowNull: true, },
  diastole: { type: db.Sequelize.FLOAT, allowNull: true, },
  resting_heart_rate: { type: db.Sequelize.FLOAT, allowNull: true, },
  ideal_weight: { type: db.Sequelize.FLOAT, allowNull: true, },
  arm: { type: db.Sequelize.FLOAT, allowNull: true, },
  arm_biceps: { type: db.Sequelize.FLOAT, allowNull: true, },
  arm_triceps: { type: db.Sequelize.FLOAT, allowNull: true, },
  back: { type: db.Sequelize.FLOAT, allowNull: true, },
  back_upper: { type: db.Sequelize.FLOAT, allowNull: true, },
  back_lower: { type: db.Sequelize.FLOAT, allowNull: true, },
  rib_cage: { type: db.Sequelize.FLOAT, allowNull: true, },
  thoracic_fat: { type: db.Sequelize.FLOAT, allowNull: true, },
  abdomen: { type: db.Sequelize.FLOAT, allowNull: true, },
  fat_rectus: { type: db.Sequelize.FLOAT, allowNull: true, },
  fat_obliques: { type: db.Sequelize.FLOAT, allowNull: true, },
  hip: { type: db.Sequelize.FLOAT, allowNull: true, },
  leg_upper: { type: db.Sequelize.FLOAT, allowNull: true, },
  leg_lower: { type: db.Sequelize.FLOAT, allowNull: true, },
  calf: { type: db.Sequelize.FLOAT, allowNull: true, },
  observation: { type: db.Sequelize.TEXT, allowNull: true, },
  customerId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: { model: 'customers', key: 'customerId', },
  },
  userId: {
    allowNull: false,
    type: db.Sequelize.INTEGER,
    references: { model: 'users', key: 'userId', },
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
  updatedAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});

const AssessmentPicture = db.sequelize.define('assessment_pictures', {
  idFile: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  assessmentId: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'assessments',
      key: 'assessmentId',
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

Assessment.belongsTo(User, { foreignKey: 'userId' });
AssessmentPicture.belongsTo(Assessment, { foreignKey: 'assessmentId' });
Assessment.hasMany(AssessmentPicture, { foreignKey: 'assessmentId' });

module.exports = {
  Assessment,
  AssessmentPicture
}
const db = require('../database/database');
const { User } = require('./auth.model');
const { Customer } = require('./customer.model');
const { Location } = require('./location.model');

const CalendarEventType = db.sequelize.define('calendar_event_types', {
  eventTypeId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  typeName: { type: db.Sequelize.STRING, allowNull: false, unique: true },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});

const CalendarEvents = db.sequelize.define('calendar_events', {
  eventId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  eventTypeId: {
    allowNull: false,
    type: db.Sequelize.INTEGER,
    references: {
      model: 'calendar_event_types',
      key: 'eventTypeId',
    },
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  },
  title: { type: db.Sequelize.TEXT, allowNull: false },
  start: { type: db.Sequelize.DATE, allowNull: false },
  end: { type: db.Sequelize.DATE, allowNull: false },
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

const CalendarEventCustomers = db.sequelize.define('calendar_event_customers', {
  eventCustomerId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  eventId: {
    allowNull: false,
    unique: 'event_customer_unique',
    type: db.Sequelize.INTEGER,
    references: {
      model: 'calendar_events',
      key: 'eventId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  customerId: {
    type: db.Sequelize.INTEGER,
    unique: 'event_customer_unique',
    allowNull: false,
    references: {
      model: 'customers',
      key: 'customerId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});


const CalendarEventTrainers = db.sequelize.define('calendar_event_trainers', {
  eventCustomerId: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  eventId: {
    allowNull: false,
    unique: 'event_trainers_unique',
    type: db.Sequelize.INTEGER,
    references: {
      model: 'calendar_events',
      key: 'eventId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userId: {
    type: db.Sequelize.INTEGER,
    unique: 'event_trainers_unique',
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  createdAt: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('now') },
}, {
  timestamps: false,
});

// CalendarEventType.hasOne(CalendarEvents, { foreignKey: 'eventTypeId' });
// Location.hasOne(CalendarEvents, { foreignKey: 'locationId' });

CalendarEvents.belongsTo(CalendarEventType, { foreignKey: 'eventTypeId' });
CalendarEvents.belongsTo(Location, { foreignKey: 'locationId' });

CalendarEvents.hasMany(CalendarEventCustomers, { foreignKey: 'eventId' });
CalendarEventCustomers.belongsTo(Customer, { foreignKey: 'customerId' });

CalendarEvents.hasMany(CalendarEventTrainers, { foreignKey: 'eventId' });
CalendarEventTrainers.belongsTo(User, { foreignKey: 'userId' });


module.exports = {
  CalendarEvents,
  CalendarEventCustomers,
  CalendarEventTrainers,
  CalendarEventType
}
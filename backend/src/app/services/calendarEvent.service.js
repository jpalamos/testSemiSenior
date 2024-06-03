
const { sequelize } = require('../../infrastructure/models/index');
const { CalendarEvents, CalendarEventTrainers, CalendarEventCustomers, CalendarEventType } = require("../../infrastructure/models/calendarEvents.model");
const { User, UserPersonalnfo, UserPicture } = require("../../infrastructure/models/auth.model");
const { Customer, CustomerPicture } = require("../../infrastructure/models/customer.model");
const { Location } = require("../../infrastructure/models/location.model");

const calendarEventGetService = (starDate, endDate, locations) => {
  return new Promise((resolve, reject) => {
    CalendarEvents.findAll({
      include: [
        { model: CalendarEventType },
        { model: Location, where: { locationId: locations ?? [] } },
        {
          model: CalendarEventCustomers,
          include: [{
            model: Customer, attributes: ['firstName', 'lastName'],
            include: [{ model: CustomerPicture }]
          },]
        },
        {
          model: CalendarEventTrainers, include: [{
            model: User, attributes: ['userId'], include: [{
              model: UserPersonalnfo, attributes: ['firstName', 'firstLastName']
            }]
          }]
        },
      ]
    })
      .then((results) => resolve(results))
      .catch((err) => reject(err))
  })
};

const calendarEventGetMastersService = () => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      return await Promise.all([
        Location.findAll({ transaction: t }),
        User.findAll({
          where: { roleId: 3, },
          include: [
            { model: UserPersonalnfo, attributes: ['firstName', 'firstLastName', 'color'] },
            { model: UserPicture, attributes: ['destination', 'filename'] },
          ],
          order: [[{ model: UserPersonalnfo }, 'firstLastName', 'ASC'], [{ model: UserPersonalnfo }, 'firstName', 'ASC']],
          attributes: ['isActive', 'userId'],
          transaction: t,
        }),
        CalendarEventType.findAll({ transaction: t, }),
        Customer.findAll({
          attributes: ['firstName', 'lastName', 'customerId'],
          limit: 500,
          order: ['lastName', 'firstName'],
          transaction: t,
        }),
      ])
    })
      .then(([locations, trainers, eventTypes, customers]) => resolve({ locations, trainers, eventTypes, customers }))
      .catch((err) => reject(err))
  })
}

const calendarEventUpdateService = (eventId, userId, { customers, start, end, eventTypeId, locationId, title, trainers }) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const event = await CalendarEvents.findOne({
        where: { eventId },
        include: [
          { model: CalendarEventCustomers, include: [{ model: Customer, attributes: ['firstName', 'lastName'] }] },
          {
            model: CalendarEventTrainers, include: [{
              model: User, attributes: ['userId'], include: [{
                model: UserPersonalnfo, attributes: ['firstName', 'firstLastName']
              }]
            }]
          },
        ],
        transaction: t
      })
      if (event) {
        const { calendar_event_customers, calendar_event_trainers } = event;
        const [eventUpdate, customerDestroy, customerCreated, trainersDestroy, trainersCreated,] = await Promise.all([
          CalendarEvents.update(
            { start, end, eventTypeId, locationId, title },
            { where: { eventId }, transaction: t }
          ),
          CalendarEventCustomers.destroy({
            where: {
              eventId,
              customerId: calendar_event_customers
                .filter(({ customerId }) =>
                  !customers.map(({ customerId }) => customerId).includes(customerId)
                )
                .map(({ customerId }) => customerId)
            },
            transaction: t
          }),
          CalendarEventCustomers.bulkCreate(
            customers
              .map(({ customerId }) => ({ customerId, eventId }))
              .filter(({ customerId }) =>
                !calendar_event_customers.map(({ customerId }) => customerId).includes(customerId)
              ),
            { transaction: t }
          ),
          CalendarEventTrainers.destroy({
            where: {
              eventId,
              userId: calendar_event_trainers
                .filter(({ userId }) =>
                  !trainers.map(({ userId }) => userId).includes(userId)
                )
                .map(({ userId }) => userId)
            },
            transaction: t
          }),
          CalendarEventTrainers.bulkCreate(
            trainers
              .map(({ userId }) => ({ userId, eventId }))
              .filter(({ userId }) =>
                !calendar_event_trainers.map(({ userId }) => userId).includes(userId)
              ),
            { transaction: t }
          )
        ])

        return { eventUpdate, customerDestroy, customerCreated, trainersDestroy, trainersCreated };
      } else {
        const eventCreate = await CalendarEvents.create(
          { userId, start, end, eventTypeId, locationId, title },
          { transaction: t }
        );

        const [customerCreated, trainersCreated] = await Promise.all([
          CalendarEventCustomers.bulkCreate(
            customers.map(({ customerId }) =>
              ({ customerId, eventId: eventCreate.eventId })
            ),
            { transaction: t }
          ),
          CalendarEventTrainers.bulkCreate(
            trainers.map(({ userId }) =>
              ({ userId, eventId: eventCreate.eventId })
            ),
            { transaction: t }
          )
        ])
        return { eventCreate, customerCreated, trainersCreated };
      }
    })
      .then((results) => resolve(results))
      .catch((err) => reject(err))
  })
}

module.exports = {
  calendarEventGetService,
  calendarEventGetMastersService,
  calendarEventUpdateService
}
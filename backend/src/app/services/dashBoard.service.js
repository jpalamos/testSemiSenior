
const { Charge, Plan } = require('../../infrastructure/models/billing.model');
const { Customer, Assistance } = require('../../infrastructure/models/customer.model');
const { UserPersonalnfo, User } = require('../../infrastructure/models/auth.model');
const { Sequelize, sequelize } = require('../../infrastructure/models/index');
const { Location } = require('../../infrastructure/models/location.model');
const { MembershipStatus } = require('../../infrastructure/models/membership.model');
const { CalendarEvents } = require('../../infrastructure/models/calendarEvents.model');

const dashboardGetService = (user) => {
  const { roleId, userId } = user;
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      return await Promise.all([
        Customer.findAll({
          ...roleId === 3 && { where: { customerId: 0 }, },
          attributes: ['membershipStatusId', [sequelize.fn('COUNT', 'membershipStatusId'), 'count']],
          group: ['membershipStatusId'],
          transaction: t
        }),
        Assistance.findAll({
          attributes: ['membershipStatusId', [sequelize.fn('COUNT', 'membershipStatusId'), 'count']],
          where: { createdAt: { [Sequelize.Op.gte]: Sequelize.fn('DATE_TRUNC', 'day', Sequelize.literal("CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota'")) } },
          group: ['membershipStatusId'],
          transaction: t,
        }),
        Charge.findAll({
          attributes: [
            [Sequelize.col('user.users_personal_info.firstName'), 'firstName'],
            [Sequelize.col('user.users_personal_info.color'), 'color'],
            [Sequelize.fn('json_agg', Sequelize.fn('json_build_object',
              sequelize.literal("'label'"), Sequelize.fn('DATE', Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('billing_charges.createdAt'))),
              sequelize.literal("'amount'"), Sequelize.col('billing_charges.amount')
            )), 'amounts'],
          ],
          include: [{
            ...roleId !== 1 && {
              where: { ...roleId === 2 ? { userId } : { userId: 0 } },
            },
            model: User,
            attributes: [],
            include: [{ model: UserPersonalnfo, attributes: [] }]
          }],
          group: ['firstName', 'color'],
          transaction: t
        }),
        Charge.findAll({
          attributes: [
            [Sequelize.fn('DATE', Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('billing_charges.createdAt'))), 'charge_date'],
          ],
          include: [{
            ...roleId !== 1 && {
              where: { ...roleId === 2 ? { userId } : { userId: 0 } },
            },
            model: User,
            attributes: [],
            include: [{ model: UserPersonalnfo, attributes: [] }]
          }],
          group: ['charge_date'],
          order: [Sequelize.fn('DATE', Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('billing_charges.createdAt')))],
          transaction: t
        }),
        Charge.findAll({
          attributes: [
            [Sequelize.col('billing_plan.plan'), 'plan'],
            [Sequelize.fn('COUNT', '*'), 'count'],
            [Sequelize.fn('SUM', Sequelize.col('billing_plan.amount')), 'amount'],
          ],
          include: [{ model: Plan, attributes: [] }],
          group: [Sequelize.col('billing_plan.plan')],
          order: [[Sequelize.fn('SUM', Sequelize.col('billing_plan.amount')), 'DESC']]
        }),
        Assistance.findAll({
          ...roleId === 3 && { where: { customerId: 0 }, },
          include: [
            { model: Customer, attributes: ['firstName', 'lastName'] },
            { model: Location, attributes: ['location'] },
            { model: MembershipStatus, attributes: ['statusName'] },
          ],
          order: [['assistanceId', 'desc']],
          transaction: t,
        }),
        Assistance.findAll({
          ...roleId === 3 && { where: { customerId: 0 }, },
          attributes: [
            [Sequelize.col('location.location'), 'locationName'],
            [Sequelize.col('membership_status.statusName'), 'membershipStatusName'],
            [Sequelize.fn('DATE', Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('assistances.createdAt'))), 'assistanceDay'],
            [Sequelize.fn('COUNT', 'assistanceId'), 'count'],
          ],
          include: [
            { model: Location, attributes: [] },
            { model: MembershipStatus, attributes: [] },
          ],
          group: ['locationName', 'assistanceDay', 'membershipStatusName',],
          transaction: t,
        }),
        Assistance.findAll({
          ...roleId === 3 && { where: { customerId: 0 }, },
          attributes: [
            [Sequelize.fn('DATE', Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('assistances.createdAt'))), 'assistanceDay'],
          ],
          include: [{ model: MembershipStatus, attributes: [] }],
          group: ['assistanceDay'],
          order: [Sequelize.fn('DATE', Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('assistances.createdAt')))],
          transaction: t,
        }),
        CalendarEvents.findAll({
          attributes: ['eventTypeId', [Sequelize.fn('COUNT', '*'), 'count'],],
          group: ['eventTypeId'],
          transaction: t,
        })
      ]);
    })
      .then(([
        customerCount, assistanceCount,
        billingBarDatasets, billingBarLabels, billingByPlans,
        assistenceList, assitenceDatasets, assitenceLabels,
        calendarEventDates
      ]) => {
        resolve({
          customer: {
            customerCount,
            assistanceCount,
          },
          billing: {
            billingBar: {
              datasets: billingBarDatasets,
              labels: billingBarLabels.map((label) => label.dataValues.charge_date),
            },
            billingByPlans,
          },
          assistence: {
            list: assistenceList,
            bar: {
              datasets: assitenceDatasets,
              labels: assitenceLabels.map((label) => label.dataValues.assistanceDay)
            }
          },
          calendarEvents: {
            dates: calendarEventDates
          }
        })
      })
      .catch((err) => reject(err));
  })
}

module.exports = {
  dashboardGetService
}
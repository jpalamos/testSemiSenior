
const { Plan, Charge, PaymentStatus } = require('../../infrastructure/models/billing.model');
const { Customer, Gender, SexualOrientation, Assistance, CustomerPicture } = require('../../infrastructure/models/customer.model');
const { Location } = require('../../infrastructure/models/location.model');
const { sequelize, Sequelize } = require('../../infrastructure/models/index');
const { MembershipStatus } = require('../../infrastructure/models/membership.model');
const { getPaginated } = require('./pagination');
const { dashboardEvent_updateConstumer, dashboardEvent_updateAssistence } = require('../../infrastructure/events/dashboard');
const { deleteFile } = require('./fileSystem.service');
const { Assessment, AssessmentPicture } = require('../../infrastructure/models/assessment.model');
const { User, UserPersonalnfo } = require('../../infrastructure/models/auth.model');


const consumerGetService = (roleId, { page, limit, search }) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const paginate = await getPaginated(Customer, page ? +page : 0, limit ? +limit : 10,
        {
          include: [
            { model: Gender },
            { model: CustomerPicture },
            { model: SexualOrientation },
            { model: Plan },
            { model: MembershipStatus },
          ],
          where: {
            ...roleId === 3 && { membershipStatusId: 1 },
            ...search && {
              [Sequelize.Op.and]: search.split(' ').map((word) => ({
                [Sequelize.Op.or]: [
                  { firstName: { [Sequelize.Op.iLike]: `%${word}%` } },
                  { lastName: { [Sequelize.Op.iLike]: `%${word}%` } },
                  Sequelize.where(Sequelize.cast(Sequelize.col('identityCard'), 'text'),
                    { [Sequelize.Op.iLike]: `%${word}%` }
                  ),
                ]
              }))
            },
          },
          order: [['customerId', 'DESC']],
        },
        t);
      const { count, rows } = paginate;
      const assessments = await Assessment.findAll({
        attributes: ['customerId', [sequelize.fn('COUNT', 'customerId'), 'count']],
        where: { customerId: rows.map(({ customerId }) => customerId) },
        group: ['customerId'],
        raw: true,
        transaction: t
      })
      return {
        count,
        rows: rows.map((row) => {
          return {
            ...row,
            assessments: assessments.find(({ customerId }) => customerId === row.customerId)?.count ?? 0
          }
        }),
      }
    })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  })
}

const consumerGetBillingService = (customerId, page, limit) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const paginate = await getPaginated(Charge, +page, +limit,
        {
          where: { customerId },
          order: [['chargeId', 'DESC']],
          include: [{ model: PaymentStatus }]
        },
        t);
      return paginate
    })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  })
}

const consumerGetVisitService = (customerId, page, limit) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const paginate = await getPaginated(Assistance, +page, +limit,
        {
          where: { customerId },
          order: [['assistanceId', 'DESC']],
          include: [{ model: MembershipStatus }, { model: Location }]
        },
        t);
      return paginate
    })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  })
}

const consumerGetMastersService = () => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      return await Promise.all([
        Gender.findAll({ transaction: t }),
        SexualOrientation.findAll({ transaction: t }),
        Plan.findAll({ transaction: t })
      ])
    })
      .then(([genders, sexualOrientations, plans]) => resolve({ genders, sexualOrientations, plans }))
      .catch((err) => reject(err))
  })
}

const addConsumerService = (dataForm, userId, file) => {
  return new Promise((resolve, reject) => {
    const { identityCard, email, ...data } = dataForm;
    sequelize.transaction(async (t) => {
      const checkDocument = await Customer.findOne({
        where: { [Sequelize.Op.or]: [{ identityCard }, { email }] },
        transaction: t
      })
      if (checkDocument) {
        throw ({ message: 'El # de documento o el email ya esta registrado' })
      }
      const consumerAdded = await Customer.create({
        ...data,
        identityCard,
        email,
        membershipStatusId: 1,
        userId
      }, { transaction: t })
      const totalConsumer = await Customer.findAll({
        attributes: ['membershipStatusId', [sequelize.fn('COUNT', 'membershipStatusId'), 'count']],
        group: ['membershipStatusId'],
        transaction: t
      })
      if (file) {
        await CustomerPicture.create(
          {
            ...file,
            customerId: consumerAdded.customerId,
          },
          { transaction: t }
        )
      }
      return {
        consumerAdded,
        totalConsumer
      }
    })
      .then(({ consumerAdded, totalConsumer }) => {
        dashboardEvent_updateConstumer(totalConsumer);
        resolve(consumerAdded)
      })
      .catch((err) => reject(err));
  })
}

const editConsumerService = (customerId, dataForm, userId, file) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const [customerUpdate, customerPicture] = await Promise.all([
        Customer.update(
          dataForm,
          {
            where: { customerId },
            transaction: t
          }
        ),
        CustomerPicture.findOne({
          where: { customerId },
          raw: true,
          transaction: t
        })
      ])
      if (file) {
        if (customerPicture?.filename) {
          await CustomerPicture.update(
            file,
            { where: { customerId }, transaction: t }
          )
        } else {
          await CustomerPicture.create(
            { ...file, customerId },
            { transaction: t }
          )
        }
      }
      return { customerUpdate, customerPicture }
    })
      .then(({ customerUpdate, customerPicture }) => {
        if (file && customerPicture?.filename) {
          deleteFile('customers', customerPicture.filename)
        }
        resolve(customerUpdate)
      })
      .catch((err) => reject(err));
  })
}

const addDuration = (starDate, duration, durationType) => {
  if (durationType === 'day') {
    return starDate.setDate(starDate.getDate() + duration);
  } else if (durationType === 'week') {
    return starDate.setDate(starDate.getDate() + (duration * 7));
  } else if (durationType === 'mount') {
    return starDate.setMonth(starDate.getMonth() + duration);
  } else if (durationType === 'year') {
    return starDate.setFullYear(starDate.getFullYear() + duration);
  } else return starDate;
}

const addConsumerChargeService = (customerId, userId) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const customer = await Customer.findOne({
        where: { customerId },
        include: [{ model: Plan }],
        transaction: t,
      })
      const lastCharge = await Charge.findOne({
        where: { customerId },
        order: [['chargeId', 'desc']],
        transaction: t,
      })
      const { duration, durationType, amount, planId } = customer.billing_plan;
      const charge = await Charge.create({
        customerId,
        amount,
        planId,
        userId,
        paymentStatusId: 1,
        paymentCompletedAt: lastCharge
          ? addDuration(new Date(lastCharge.paymentCompletedAt), duration, durationType)
          : addDuration(new Date(), duration, durationType)
      }, { transaction: t })
      return charge;
    })
      .then((customer) => resolve(customer))
      .catch((err) => reject(err))
  })

}

const getConsumerAssitenceService = (page, limit) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const paginate = await getPaginated(Assistance, +page, +limit,
        {
          order: [['assistanceId', 'DESC']],
          include: [{ model: MembershipStatus }]
        },
        t);
      return paginate
    })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  })
}

const addConsumerAssitenceService = (customerId, locationId, userId) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const customer = await Customer.findOne({
        where: { customerId },
        include: [{ model: Plan }, { model: CustomerPicture }],
        transaction: t,
      })
      if (!customer) {
        throw ({ message: 'Lo sentimos, este usuario no existe, por favor contacte al administrador.' });
      } else {
        const { customerId, membershipStatusId } = customer;
        const [assistanceCreated, assistanceValid] = await Promise.all([
          Assistance.create({
            customerId,
            userId,
            locationId,
            membershipStatusId
          }, { transaction: t }),
          Assistance.findAll({
            where: {
              customerId,
              createdAt: { [Sequelize.Op.gte]: Sequelize.fn('DATE_TRUNC', 'day', Sequelize.literal("CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota'")) }
            },
          }, { transaction: t }),
        ])
        if (membershipStatusId > 1) {
          throw ({ membershipStatusId, message: 'Lo sentimos, este usuario no está habilitado para ingresar, por favor contacte al administrador.', });
        } else if (assistanceValid.length > 0) {
          throw ({ assistanceValid, message: `Lo sentimos, este usuario ya fue registrado el día de hoy con ${assistanceValid.length} ingreso${assistanceValid.length > 1 ? 's' : ''}, por favor contacte al administrador.`, });
        }
        const assistance = await Assistance.findOne({
          where: { assistanceId: assistanceCreated.assistanceId },
          include: [
            { model: Customer, attributes: ['firstName', 'lastName'] },
            { model: Location, attributes: ['location'] },
            { model: MembershipStatus, attributes: ['statusName'] },
          ],
          transaction: t,
        })
        return { customer, assistance };
      }
    })
      .then(({ customer, assistance }) => {
        dashboardEvent_updateAssistence(assistance);
        resolve({ customer, assistance });
      })
      .catch((err) => reject(err))
  })

}

const getConsumerAssessmentService = (customerId) => {
  return new Promise((resolve, reject) => {
    Assessment.findAll({
      where: { customerId },
      include: [
        { model: AssessmentPicture },
        {
          model: User, attributes: ['userId'],
          include: [{ model: UserPersonalnfo, attributes: ['firstName', 'firstLastName'] }]
        }
      ],
      order: [['attentionDate', 'ASC']]
    })
      .then((users) => resolve(users))
      .catch((err) => reject(err));
  })
}

const addConsumerAssessmentService = (customerId, body, userId, files) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const assessment = await Assessment.create({
        ...body,
        customerId,
        userId,
      }, { transaction: t });
      const assessmentPicture = await AssessmentPicture.bulkCreate(
        files.map((file) => ({ ...file, assessmentId: assessment.assessmentId })),
        { transaction: t }
      )
      return { assessment, assessmentPicture };
    })
      .then((assessment) => resolve(assessment))
      .catch((err) => reject(err))
  })
}

const editConsumerAssessmentService = (assessmentId, body, userId, files) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const assessment = await Assessment.update({
        ...body,
        updatedAt: Sequelize.fn('now')
      }, { where: { assessmentId }, transaction: t });
      if (files) {
        await AssessmentPicture.bulkCreate(
          files.map((file) => ({ ...file, assessmentId })),
          { transaction: t }
        )
      }
      return { assessment };
    })
      .then((assessment) => resolve(assessment))
      .catch((err) => reject(err))
  })
}

const deleteConsumerAssessmentImgService = (idFile, userId) => {
  return new Promise((resolve, reject) => {
    sequelize.transaction(async (t) => {
      const picture = await AssessmentPicture.findOne({ where: { idFile }, raw: true, transaction: t });
      const pictureDeleted = await AssessmentPicture.destroy({ where: { idFile }, transaction: t })
      return { picture, pictureDeleted }
    })
      .then(({ picture, pictureDeleted }) => {
        deleteFile('assessment', picture.filename)
        resolve({ picture, pictureDeleted })
      })
      .catch((err) => reject(err));
  })
}

module.exports = {
  addConsumerService,
  consumerGetService,
  consumerGetMastersService,
  consumerGetBillingService,
  consumerGetVisitService,
  addConsumerChargeService,
  getConsumerAssitenceService,
  addConsumerAssitenceService,
  editConsumerService,
  getConsumerAssessmentService,
  addConsumerAssessmentService,
  editConsumerAssessmentService,
  deleteConsumerAssessmentImgService,
}
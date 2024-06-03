const { consumerGetService, consumerGetMastersService, consumerGetBillingService, addConsumerChargeService, addConsumerAssitenceService, getConsumerAssitenceService, consumerGetVisitService, addConsumerService, editConsumerService, addConsumerAssessmentService, getConsumerAssessmentService, deleteConsumerAssessmentImgService, editConsumerAssessmentService } = require('../services/consumer.service');
const { deleteFile } = require('../services/fileSystem.service');
const getConsumer = (req, res) => {
  const { page, limit, search } = req.query;
  const { roleId } = req.user;
  consumerGetService(roleId, { page, limit, search })
    .then((register) => res.status(202).json(register))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const getBilling = (req, res) => {
  const { page, limit } = req.query;
  const { customerId } = req.params;
  consumerGetBillingService(customerId, page, limit)
    .then((register) => res.status(202).json(register))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const getVisit = (req, res) => {
  const { page, limit } = req.query;
  const { customerId } = req.params;
  consumerGetVisitService(customerId, page, limit)
    .then((register) => res.status(202).json(register))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const getConsumerMasters = (req, res) => {
  consumerGetMastersService()
    .then((masters) => res.status(202).json(masters))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const addConsumer = (req, res) => {
  const { files, body } = req;
  const { userId } = req.user;
  const { identityCard, firstName, lastName, planId, dateOfBirth, email, phoneNumber, address, genderId, sexualOrientationId } = body.dataForm
    ? JSON.parse(req.body.dataForm)
    : body;
  if (identityCard && firstName && lastName && planId && dateOfBirth && email && phoneNumber && address && genderId && sexualOrientationId) {
    addConsumerService(
      { identityCard, firstName, lastName, planId, dateOfBirth, email, phoneNumber, address, genderId, sexualOrientationId }
      , userId,
      files && files.length > 0 ? files[0] : null
    )
      .then((consumer) => res.status(202).json(consumer))
      .catch((err) => {
        console.error(err);
        if (files.length > 0) {
          files.forEach((file) => {
            deleteFile('customers', file.filename)
          });
        }
        res.status(500).send(err)
      })
  } else {
    if (files.length > 0) {
      files.forEach((file) => {
        deleteFile('customers', file.filename)
      });
    }
    res.status(428).json({ message: 'InvalidParameterError' })
  }
}

const editConsumer = (req, res) => {
  const { files, body } = req;
  const { customerId } = req.params;
  const { userId } = req.user;
  const { identityCard, firstName, lastName, planId, dateOfBirth, email, phoneNumber, address, genderId, sexualOrientationId } = body.dataForm
    ? JSON.parse(req.body.dataForm)
    : body;
  if (identityCard && firstName && lastName && planId && dateOfBirth && email && phoneNumber && address && genderId && sexualOrientationId) {
    editConsumerService(
      customerId,
      { identityCard, firstName, lastName, planId, dateOfBirth, email, phoneNumber, address, genderId, sexualOrientationId },
      userId,
      files && files.length > 0 ? files[0] : null
    )
      .then((consumer) => res.status(202).json(consumer))
      .catch((err) => {
        console.error(err);
        if (files.length > 0) {
          files.forEach((file) => {
            deleteFile('customers', file.filename)
          });
        }
        res.status(500).send(err)
      })
  } else {
    if (files.length > 0) {
      files.forEach((file) => {
        deleteFile('customers', file.filename)
      });
    }
    res.status(428).json({ message: 'InvalidParameterError' })
  }
}

const addCharge = (req, res) => {
  const { customerId } = req.params;
  const { userId } = req.user;
  addConsumerChargeService(customerId, userId)
    .then((consumer) => res.status(202).json(consumer))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const getAssistence = (req, res) => {
  const { page, limit } = req.query;
  getConsumerAssitenceService(page, limit)
    .then((assistences) => res.status(202).json(assistences))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const addAssistence = (req, res) => {
  const { locationId } = req.body;
  const { customerId } = req.params;
  const { userId } = req.user;
  addConsumerAssitenceService(customerId, locationId, userId)
    .then((consumer) => res.status(202).json(consumer))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const getAssessment = (req, res) => {
  const { customerId } = req.params;
  getConsumerAssessmentService(customerId)
    .then((register) => res.status(202).json(register))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const addAssessment = (req, res) => {
  const { customerId } = req.params;
  const { files, body } = req;
  const { userId } = req.user;
  const {
    attentionDate,
    weight, height, BMI, body_fat_percentage, viceral_fat, esquel_muscle_percentage, systole,
    diastole, resting_heart_rate, ideal_weight, arm, arm_biceps, arm_triceps, back, back_upper, back_lower,
    rib_cage, thoracic_fat, abdomen, fat_rectus, fat_obliques, hip, leg_upper, leg_lower, calf, observation,
  } = body.dataForm
      ? JSON.parse(req.body.dataForm)
      : body;

  addConsumerAssessmentService(customerId, {
    attentionDate,
    weight, height, BMI, body_fat_percentage, viceral_fat, esquel_muscle_percentage, systole,
    diastole, resting_heart_rate, ideal_weight, arm, arm_biceps, arm_triceps, back, back_upper, back_lower,
    rib_cage, thoracic_fat, abdomen, fat_rectus, fat_obliques, hip, leg_upper, leg_lower, calf, observation,
  }, userId, files ?? [])
    .then((consumer) => res.status(202).json(consumer))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const editAssessment = (req, res) => {
  const { assessmentId } = req.params;
  const { files, body } = req;
  const { userId } = req.user;
  const {
    attentionDate,
    weight, height, BMI, body_fat_percentage, viceral_fat, esquel_muscle_percentage, systole,
    diastole, resting_heart_rate, ideal_weight, arm, arm_biceps, arm_triceps, back, back_upper, back_lower,
    rib_cage, thoracic_fat, abdomen, fat_rectus, fat_obliques, hip, leg_upper, leg_lower, calf, observation,
  } = body.dataForm
      ? JSON.parse(req.body.dataForm)
      : body;

  editConsumerAssessmentService(assessmentId, {
    attentionDate,
    weight, height, BMI, body_fat_percentage, viceral_fat, esquel_muscle_percentage, systole,
    diastole, resting_heart_rate, ideal_weight, arm, arm_biceps, arm_triceps, back, back_upper, back_lower,
    rib_cage, thoracic_fat, abdomen, fat_rectus, fat_obliques, hip, leg_upper, leg_lower, calf, observation,
  }, userId, files ?? null)
    .then((consumer) => res.status(202).json(consumer))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

deleteAssessmentImg = (req, res) => {
  const { idFile } = req.params;
  const { userId } = req.user;
  deleteConsumerAssessmentImgService(idFile, userId)
    .then((register) => res.status(202).json(register))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

module.exports = {
  addConsumer,
  editConsumer,
  getConsumer,
  getConsumerMasters,
  getBilling,
  getVisit,
  addCharge,
  addAssistence,
  getAssistence,
  getAssessment,
  addAssessment,
  editAssessment,
  deleteAssessmentImg,
}
const express = require('express');
const router = express.Router();

const upload = require('../app/middlewares/multer.service')
const security = require("../app/middlewares/security.service");

const auth = require("../app/controllers/auth.controller");
const config = require("../app/controllers/config.controller");
const consumer = require('../app/controllers/consumer.controller');
const calendarEvent = require('../app/controllers/calendarEvent.controller');
const DashBoard = require('../app/controllers/dashboard.controller');
const { uploadGetfile } = require('../app/controllers/upload.controller');

router.post('/auth/login', auth.loginController);
router.post('/auth/register', security.checkToken, upload('auth').array('files', 1), auth.register);
router.patch('/auth/register/:userId', security.checkToken, upload('auth').array('files', 1), auth.registerEdit);
router.get('/auth/register', security.checkToken, auth.getRegister);
router.get('/auth/trainers', security.checkToken, auth.getTrainers);

router.get('/config/masters', security.checkToken, config.getMasters);
router.get('/uploads/:dirFolder/:filename', security.checkToken, uploadGetfile);

router.post('/customer', security.checkToken, upload('customers').array('files', 1), consumer.addConsumer);
router.patch('/customer/:customerId', security.checkToken, upload('customers').array('files', 1), consumer.editConsumer);
router.get('/customer/register', security.checkToken, consumer.getConsumer);
router.get('/customer/billing/:customerId', security.checkToken, consumer.getBilling);
router.get('/customer/visit/:customerId', security.checkToken, consumer.getVisit);
router.post('/customer/charge/:customerId', security.checkToken, consumer.addCharge);
router.patch('/customer/assistence/:customerId', security.checkToken, consumer.addAssistence);
router.get('/customer/assistence', security.checkToken, consumer.getAssistence);
router.get('/customer/masters', security.checkToken, consumer.getConsumerMasters);
router.get('/customer/assessment/:customerId', security.checkToken, consumer.getAssessment);
router.post('/customer/assessment/:customerId', security.checkToken, upload('assessment').array('files', 10), consumer.addAssessment);
router.patch('/customer/assessment/:assessmentId', security.checkToken, upload('assessment').array('files', 10), consumer.editAssessment);
router.delete('/customer/assessment/img/:idFile', security.checkToken, consumer.deleteAssessmentImg);

router.get('/calendarEvent/events', security.checkToken, calendarEvent.calendarEventGetEvents);
router.get('/calendarEvent/masters', security.checkToken, calendarEvent.calendarEventGetMasters);
router.patch('/calendarEvent/:eventId', security.checkToken, calendarEvent.calendarEventUpdate);

router.get('/dahboard', security.checkToken, DashBoard.getDashboard);


module.exports = router
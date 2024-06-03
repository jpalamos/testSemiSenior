const { calendarEventGetService, calendarEventGetMastersService, calendarEventUpdateService } = require("../services/calendarEvent.service");

const calendarEventGetEvents = (req, res) => {
  const { starDate, endDate, locations } = req.query;
  calendarEventGetService(starDate, endDate, locations)
    .then((register) => res.status(202).json(register))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const calendarEventGetMasters = (req, res) => {
  calendarEventGetMastersService()
    .then((masters) => res.status(201).json(masters))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}


const calendarEventUpdate = (req, res) => {
  const { eventId } = req.params;
  const { customers, start, end, eventTypeId, locationId, title, trainers } = req.body;
  const { userId } = req.user;
  calendarEventUpdateService(+eventId, userId, { customers, start, end, eventTypeId, locationId, title, trainers })
    .then((updates) => res.status(201).json(updates))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}


module.exports = {
  calendarEventGetEvents,
  calendarEventGetMasters,
  calendarEventUpdate
}
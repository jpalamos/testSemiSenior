const { dashboardGetService } = require('../services/dashBoard.service');

const getDashboard = (req, res) => {
  const { page, limit } = req.query;
  dashboardGetService(req.user, page, limit)
    .then((register) => res.status(202).json(register))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

module.exports = {
  getDashboard
}
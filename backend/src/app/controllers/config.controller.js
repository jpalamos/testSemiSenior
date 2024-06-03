const { getLocationsService, getMastersService } = require("../services/config.services")

const getLocations = (req, res) => {
  getLocationsService()
    .then((locations) => res.status(202).json(locations))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}

const getMasters = (req, res) => {
  getMastersService()
    .then((masters) => res.status(202).json(masters))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err)
    })
}


module.exports = {
  getLocations,
  getMasters
}
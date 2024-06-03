const { getLocationsService, getMastersService } = require("../services/config.services")

const uploadGetfile = (req, res) => {
  const { dirFolder, filename } = req.params;
  res.sendFile(filename, { root: 'uploads/' + dirFolder }, (err) => {
    if (err) {
      return res.status(408).json({ message: 'El archivo no existe' });
    }
  });
}

module.exports = {
  uploadGetfile
}

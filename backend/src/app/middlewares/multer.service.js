const path = require('path');
const fs = require('fs');
const multer = require('multer');

module.exports = (destinationFolder) => multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join('uploads', destinationFolder);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)) //Appending extension
    }
  })
})

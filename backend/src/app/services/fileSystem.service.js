const fs = require('fs');
const path = require('path');

const deleteFile = (destinationFolder, filename) => {
  fs.unlink(path.join('uploads', destinationFolder + '/' + filename), (err) => {
    if (err) {
      console.error('Error al eliminar el archivo:', err);
      return;
    }
    console.log('Archivo eliminado correctamente:', destinationFolder + '/' + filename);
  });
}

module.exports = {
  deleteFile,
}
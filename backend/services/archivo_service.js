const UploadFile = require('../utils/UploadToGCS');
const ModuloArchivo = require('../models/Archivo');
const { patch } = require('../routes/archivo');
const Archivo = ModuloArchivo.modelo;



module.exports = {

  guardarArchivosDB: async function (req, res, next) {
    const files = req.files;
    const allFiles = [];
    let url
    try {
      for (let key in files) {
      const file = {}
      let fileInfo = Object(...files[key]);
      const confirmName = await Archivo.findOne({nombreArchivo: fileInfo.originalname});
      if (!confirmName) {
        url = await UploadFile.uploadToGCS(fileInfo, fileInfo.originalname, next)
      } else {

      }
      file.categoriaArchivo = key;
      file.nombreArchivo = fileInfo.originalname;
      file.urlArchivo = url; 
      allFiles.push(file);
    }
    await Archivo.create(allFiles)
    } catch (err) {
      console.log(err)
    }
  },

  subirArchivosAGCS: async function (req, res) {
    await UploadFile.uploadToGCS(req)
    res.json({
      ruta: 'https://www.muycomputer.com/wp-content/uploads/2016/07/portada.jpg'
    })
  },
}
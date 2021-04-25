const UploadFile = require('../utils/UploadToGCS');
const ModuloArchivo = require('../models/Archivo');
const Archivo = ModuloArchivo.modelo;

// TODO: Determinar fuente de verdad para categorías
const categoriasArchivos = ['Foto', 'Factura']
module.exports = {


  guardarArchivosDB: async function (req, res) {
    return true;
  },

  subirArchivosAGCS: async function(req, res){
  await UploadFile.uploadToGCS(req)
    res.json({
      ruta: 'https://www.muycomputer.com/wp-content/uploads/2016/07/portada.jpg'
    })
  },

}
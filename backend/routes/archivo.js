const express = require('express');
const router = express.Router();
const token = require('../services/token_service');
const UploadFile = require('../utils/UploadToGCS');
const archivoService = require('../services/archivo_service')

const Multer = require('multer');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});

// TODO: Determinar fuente de verdad para categorías
const categoriasArchivos = ['Foto', 'Factura']

router.post('/postFile', token.checkToken, multer.fields(categoriasArchivos), async function (req, res) {
  const resultadoGuardarDB = await archivoService.guardarArchivosDB(req);
  const archivos = {}
  if (resultadoGuardarDB) {
   return res.json({ mensaje: 'Ocurrió un error', ok: false });
  }
   const resultadoSubirGCS = await UploadFile.uploadToGCS(req)
  if (resultadoSubirGCS) {
    return res.json({ mensaje: 'Ocurrió un error', ok: false });
   }
   return res.json({ mensaje: 'Archivos guardados' archivos, ok: true });
});
const express = require('express');
const router = express.Router();
const token = require('../services/token_service');
const archivoService = require('../services/archivo_service')
const categorias = require('../data/categoria_archivos.json')
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

const categoriasArchivos = [...Object.values(categorias)]

router.post('/postFile', token.checkToken, multer.fields(categoriasArchivos.map(name => ({name: name}))), function (req, res, next) {
  return archivoService.guardarArchivosDBYGCS(req, res, next);
});

module.exports = router;
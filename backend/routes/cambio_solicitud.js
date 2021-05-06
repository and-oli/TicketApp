const express = require('express');
const router = express.Router();
const cambioService = require('../services/cambio_solicitud_service')
const token = require('../services/token_service');

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});

router.post('/:idSolicitud',token.checkToken, async function (req, res) {
  await cambioService.cambio(req, res)
});

router.get('/cambios/:idSolicitud',token.checkToken, async function (req, res) {
  await cambioService.getCambiosPorSolicitud(req, res);
});

module.exports = router;
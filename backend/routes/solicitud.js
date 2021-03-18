const express = require('express');
const router = express.Router();
const token = require('../services/token_service');
const solicitudesService = require('../services/solicitud_service');

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});

router.get('/', async function (req, res) {
  await solicitudesService.getSolicitudes(res);
});

router.get('/asignadasAUsuario/:idUsuarioMongo', async function (req, res) {
  await solicitudesService.getSoliUsuario(req, res);
});

router.get('/porNumero/:idSolicitud', async function (req, res) {
  await solicitudesService.getSoliNumero(req, res);
});

router.post('/', async function (req, res) {
  await solicitudesService.postSolicitud(req, res);
});

module.exports = router;

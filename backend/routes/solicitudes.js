const express = require('express');
const router = express.Router();
const token = require("../services/token");
const solicitudesService = require('../services/solicitudesService');

router.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token"
  );
  next();
});

router.get('/', token.checkToken, async function (req, res) {
  const rutaGeneral = await solicitudesService.getSolicitudes(res);
  return rutaGeneral
});

router.get('/asignadasAUsuario/:idUsuarioMongo', token.checkToken, async function (req, res) {
  const rutaPorUsuario = await solicitudesService.getSoliUsuario(res, req);
  return rutaPorUsuario
});

router.get('/porNumero/:idSolicitud', token.checkToken, async function (req, res) {
  const rutaPorId = await solicitudesService.getSoliNumero(res, req);
  return rutaPorId
});

router.post('/', token.checkToken, async function (req, res) {
  const rutaCrear = await solicitudesService.postSolicitud(res, req);
  return rutaCrear
});

module.exports = router;

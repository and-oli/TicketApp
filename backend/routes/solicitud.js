const express = require('express');
const router = express.Router();
const token = require("../services/token_service");
const solicitudesService = require('../services/solicitud_service');

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
  return await solicitudesService.getSolicitudes(res);
});

router.get('/asignadasAUsuario/:idUsuarioMongo', token.checkToken, async function (req, res) {
  return await solicitudesService.getSoliUsuario(res, req);
});

router.get('/porNumero/:idSolicitud', token.checkToken, async function (req, res) {
  return await solicitudesService.getSoliNumero(res, req);
});

router.post('/', token.checkToken, async function (req, res) {
  return await solicitudesService.postSolicitud(res, req);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const token = require('../services/token_service');
const incumbentes = require('../services/incunbentes_service')

router.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});

router.get('/listaDeIncumbentes/:idSolicitud', token.checkToken, async function (req, res) {
  await incumbentes.getIncumbentes(req, res);
});

router.get('/posiblesIncumbentes', async function (req, res) {
  await incumbentes.getPosiblesIncumbentes(req, res);
});

router.post('/deleteIncumbente', token.checkToken, async function (req, res) {
  await incumbentes.actualizarIncumbentes(req, res);
});

router.post('/nuevoIncumbente', token.checkToken,async function (req, res) {
  await incumbentes.postIncumbentes(req, res);
});

module.exports = router;
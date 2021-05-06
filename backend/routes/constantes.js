const express = require('express');
const router = express.Router();
const token = require('../services/token_service');
const constantes = require('../services/const_service')
router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});


router.get('/categoriasArchivos', token.checkToken,async function (req, res) {
  await constantes.getCategoriasArchivos(res)
});

router.get('/categoriasSolicitud', token.checkToken,async function (req, res) {
  await constantes.getCategriasSolicitud(res)
});

router.get('/estados', token.checkToken,async function (req, res) {
  await constantes.getEstado(res)
});

router.get('/prioridad', token.checkToken,async function (req, res) {
  await constantes.getPrioridad(res)
});

router.get('/roles', token.checkToken,async function (req, res) {
  await constantes.getRoles(res)
});

router.get('/tipoRequerimiento', token.checkToken,async function (req, res) {
  await constantes.getTipoDeRequerimiento(res)
});

module.exports = router;
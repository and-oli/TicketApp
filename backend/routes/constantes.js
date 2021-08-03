const express = require('express');
const router = express.Router();
const token = require('../services/token_service');
const categoriasDeArchivos = require('../data/categoria_archivos.json')
const estados = require('../data/estado.json')
const prioridad = require('../data/prioridad.json')
const roles = require('../data/roles.json')
const tipoDeRequerimiento = require('../data/tipo_de_requerimiento.json')
const ProyectosSchema = require('../models/Proyecto');
const ModeloProyectos = ProyectosSchema.modulo;

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
  res.json(categoriasDeArchivos)
});

router.get('/estados', token.checkToken,async function (req, res) {
  res.json(estados)
});

router.get('/prioridad', token.checkToken,async function (req, res) {
  res.json(prioridad)
});

router.get('/roles', token.checkToken,async function (req, res) {
  res.json(roles)
});

router.get('/tipoRequerimiento', token.checkToken,async function (req, res) {
  res.json(tipoDeRequerimiento)
});

module.exports = router;

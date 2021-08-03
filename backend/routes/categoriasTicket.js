const express = require('express');
const router = express.Router();
const token = require('../services/token_service');
const categoriasSevice = require('../services/categorias_ticket_services');

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});


router.get('/', token.checkToken,async function (req, res) {
  await categoriasSevice.getCategorias(req, res);
});

router.post('/nuevaCategoria', async function (req, res) {
  await categoriasSevice.postCategorias(req, res);
})

router.post('/editarCategoria', async function (req, res) {
  await categoriasSevice.editarCategoria(req, res);
})

module.exports = router;
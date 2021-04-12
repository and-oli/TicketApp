const express = require('express');
const router = express.Router();
const token = require('../services/token_service');
const userService = require('../services/usuario_service')

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});

router.post('/', async function (req, res) {
  await userService.postUser(req.body, res);
});

router.post('/editar/password', token.checkToken, (req, res, next) => userService
  .validUser(req.body, res, next), async function (req, res) {
    await userService.updatePassword(req.body, res);
  });

router.post('/editar/email', token.checkToken, (req, res, next) => userService
  .validUser(req.body, res, next), async function (req, res) {
    await userService.updateEmail(req.body, res);
  });

router.post('/editar/username', token.checkToken, (req, res, next) => userService
  .validUser(req.body, res, next), async function (req, res) {
    await userService.updateUsername(req.body, res);
  });

router.post('/authenticate', async function (req, res) {
    await token.authorizeUser(req.body, res);
});

router.get('/clientes', token.checkToken, async function (req, res) {
  await userService.getClientes(res);
});

router.get('/validarToken', token.checkToken, function(req, res) {
  res.send({ success: true, message: 'Token válido'});
});

router.get('/', token.checkToken, async function (req, res){
  await userService.getUserTecnicos(req, res)
})

module.exports = router;

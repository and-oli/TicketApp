const express = require('express');
const router = express.Router();
const cambioService = require('../services/cambio_solicitud_service')
const token = require('../services/token_service');
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

router.post('/postFile', token.checkToken, multer.single("file"), async function (req, res) {
  console.log(req.body)
  await cambioService.postFile(req, res)
})

router.post('/:idSolicitud',token.checkToken, async function (req, res) {
  await cambioService.cambio(req, res)
});

router.get('/cambios/:idSolicitud',token.checkToken, async function (req, res) {
  await cambioService.getCambiosPorSolicitud(req, res);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const cambioService = require('../services/cambio_solicitud_service')

router.post('/', async function (req, res) {
  await cambioService.cambio(req.body, res)
});

router.post('/enviarCorreo',async function (req, res) {
  await cambioService.enviarCorreo(req.body, res)
});

module.exports = router;
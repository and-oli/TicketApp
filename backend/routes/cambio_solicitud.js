const express = require('express');
const router = express.Router();
const cambioService = require('../services/cambio_solicitud_service')
const token = require('../services/token_service');

router.post('/:idSolicitud',token.checkToken, async function (req, res) {
  await cambioService.cambio(req, res)
});

module.exports = router;
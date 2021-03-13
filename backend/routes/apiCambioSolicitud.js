const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CambiosSoliSchema = require('../models/CambiosSolicitudes');
const Cambio = mongoose.model('cambiosSolicitud', CambiosSoliSchema);
const cambioService = require('../services/cambioSoliService');
const SolicitudSchema = require('../models/Solicitudes');
const Solicitud = mongoose.model('solicitudes', SolicitudSchema);

router.post('/nuevoCambio', async function (req, res) {
  const nuevaNota = await cambioService.postNota(req, res);
  return nuevaNota
});

router.put('/', async function (req, res) {
  await Solicitud.updateOne({ idSolicitud: req.body.idSolicitud }, { estado: req.body.estado })

  const cambioSolicitud = new Cambio();
  for (let llave in req.body) {
    cambioSolicitud[llave] = req.body[llave];
  }

  const promesa = cambioSolicitud.save()
  promesa.then(() => res.json({
    mensaje: 'Cambio guardado.',
    ok: true,
  })).catch(error => {
    console.error(error);
    res.json({
      mensaje: 'Hubo un error.',
      ok: false,
    })
  })
});

module.exports = router;
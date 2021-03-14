const express = require('express');
const router = express.Router();
const ModuloCambioSolicitud = require('../models/CambioSolicitud');
const CambioSolicitud = ModuloCambioSolicitud.modelo;
const ModuloSolicitud = require('../models/Solicitud');
const Solicitud = ModuloSolicitud.modelo

router.post('/nuevoCambio', async function (req, res) {
  await Solicitud.updateOne({ idSolicitud: req.body.idSolicitud }, { estado: req.body.estado })

  const cambioSolicitud = new CambioSolicitud();
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
var express = require('express');
var router = express.Router();
const solicitudesService = require('../services/solicitudesService');

router.get('/', async function (req, res) {
  const rutaGeneral = await solicitudesService.getSolicitudes(res);
  return rutaGeneral
});

router.get('/asignadasAUsuario/:idUsuarioMongo', async function (req, res) {
  const rutaPorUsuario = await solicitudesService.getSoliUsuario(res, req);
  return rutaPorUsuario
});

router.get('/porNumero/:idSolicitud', async function (req, res) {
  const rutaPorId = await solicitudesService.getSoliNumero(res, req);
  return rutaPorId
});

router.post('/', async function (req, res) {
  const rutaCrear = await solicitudesService.postSolicitud(res, req);
  return rutaCrear
});

// // ------para cambios solicitud --------------------------------------
// router.put('/:estado', function (req, res) {
//   Solicitudes.findOneAndUpdate({ estado: req.body.estado }
//   ).then(estado => res.json(estado))
//     .catch(error => console.log(error, 'Hubo un error...'))
// });

module.exports = router;

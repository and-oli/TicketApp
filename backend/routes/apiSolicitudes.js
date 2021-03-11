var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const SolicitudSchema = require('../schemas/Solicitudes');
const Solicitudes = mongoose.model('solicitudes', SolicitudSchema);

function enviarError(error) {
  res.json({
    mensaje: 'Hubo un error...',
    ok: false,
  });
  console.error(error);
};

router.get('/', function (req, res) {
  Solicitudes.find().then(solicitudes => res.json({
    mensaje: 'Solicitud exitosa...',
    ok: true,
    solicitudes,
  }))
    .catch(enviarError);
});

router.get('/asignadasAUsuario/:idUsuarioMongo', function (req, res) {
  Solicitudes.find({ idUsuarioMongo: req.params.idUsuarioMongo })
    .populate('idUsuarioMongo').then(solicitudPorUsuario => res.json(solicitudPorUsuario))
    .catch(enviarError)
});

router.get('/porNumero/:idSolicitud', function (req, res) {
  Solicitudes.find({ idSolicitud: req.params.idSolicitud })
    .then(solicitudPorId => {
      if (solicitudPorId.length === 0) {
        res.json({
          mensaje: `No se encontraron solicitudes con ese id: ${req.params.idSolicitud}`,
          ok: false,
        })
      } else {
        res.json({
          mensaje: 'Solicitud exitosa...',
          ok: true,
          solicitud: solicitudPorId[0],
        })
      }
    })
    .catch(enviarError);
});

router.post('/', function (req, res) {
  Solicitudes.create({
    idSolicitud: req.body.idSolicitud,
    resumen: req.body.resumen,
    desripcion: req.body.desripcion,
    fechaHora: new Date(),
    estado: req.body.estado,
    categoria: req.body.categoria,
    idUsuarioMongo: req.body.idUsuarioMongo,
    idCliente: req.body.idCliente,
    // idTarea: { Tarea },
    // idProyecto: { Proyecto },
  })
    .then(solicitudcreada => res.json({
      mensaje: 'Solicitud creada...',
      ok: true,
      solicitud: solicitudcreada,
    })).catch(enviarError)
});

// ------para cambios solicitud --------------------------------------
router.put('/:estado', function (req, res) {
  Solicitudes.findOneAndUpdate({ estado: req.body.estado }
  ).then(estado => res.json(estado))
    .catch(error => console.log(error, 'Hubo un error...'))
});

module.exports = router;


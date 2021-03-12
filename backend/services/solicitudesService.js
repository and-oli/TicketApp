const mongoose = require('mongoose');
const SolicitudSchema = require('../models/Solicitudes');
const Solicitudes = mongoose.model('solicitudes', SolicitudSchema);

function enviarError(error) {
  console.error(error);
  return {
    mensaje: 'Hubo un error...',
    ok: false,
  };

};

module.exports = {

  getSolicitudes: async function (res) {
    const mostrarSolicitudes = (await Solicitudes.find().then(solicitudes => res.json({
      mensaje: 'Solicitud exitosa...',
      ok: true,
      solicitudes,
    }))
      .catch(enviarError)
    )
    return mostrarSolicitudes;
  },

  getSoliUsuario: async function (req, res) {
    const solitudesPorUsuario = (await Solicitudes.find({ idUsuarioMongo: req.params.idUsuarioMongo })
      .populate('idUsuarioMongo').then(solicitudPorUsuario => res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes: solicitudPorUsuario,
      }))
      .catch(enviarError)
    )
    return solitudesPorUsuario;
  },

  getSoliNumero: async function (req, res) {
    const solicitudesPorId = (await Solicitudes.find({ idSolicitud: req.params.idSolicitud })
      .then(solicitudPorId => {
        if (solicitudPorId.length === 0) {
          res.json({
            mensaje: `No se encontraron solicitudes con el id: ${req.params.idSolicitud}`,
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
      .catch(enviarError)
    )
    return solicitudesPorId;
  },

  postSolicitud: async function (req, res) {

    const idUnico = (await Solicitudes.find())
    let id = idUnico.length + 1

    const crearSolicitud = (await Solicitudes.create({
      idSolicitud: id,
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
      }))
      .catch(enviarError)
    )
    return crearSolicitud;
  },

};
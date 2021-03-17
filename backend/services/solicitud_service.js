const ModuloSolicitud = require('../models/Solicitud');
const Solicitud = ModuloSolicitud.modelo;

function enviarError(res, error) {
  console.error(error);
  return res.json({
    mensaje: 'Hubo un error...',
    ok: false,
  });
};

module.exports = {

  getSolicitudes: async function (res) {
    try {
      const solicitudes = await Solicitud.find();
      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes,
      });
    } catch (error) {
      enviarError(res, error);
    }
  },

  getSoliUsuario: async function (res, req) {
    try {
      const solicitudesPorUsuario = await Solicitud.find({ idUsuarioMongo: req.params.idUsuarioMongo })
        .populate('idUsuarioMongo')
      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes: solicitudesPorUsuario,
      })
    } catch (error) {
      enviarError(res, error)
    }
  },

  getSoliNumero: async function (res, req) {
    try {
      const solicitudesPorId = await Solicitud.find({ idSolicitud: req.params.idSolicitud })
      if (solicitudesPorId.length === 0) {
        res.json({
          mensaje: `No se encontraron solicitudes con ese id: ${req.params.idSolicitud}`,
          ok: false,
        })
      } else {
        res.json({
          mensaje: 'Solicitud exitosa...',
          ok: true,
          solicitud: solicitudesPorId[0],
        })
      }
    } catch (error) {
      enviarError(res, error)
    }
  },

  postSolicitud: async function (res, req) {
    try {
      const crearSolicitud = await Solicitud.create({
        idSolicitud: req.body.idSolicitud,
        resumen: req.body.resumen,
        desripcion: req.body.descripcion,
        fechaHora: new Date(),
        estado: 'Sin asignar (abierta)',
        categoria: req.body.categoria,
        refUsuarioAsignado: req.body.refUsuarioAsignado,
        refCliente: req.body.refCliente,
      })
      res.json({
        mensaje: 'Solicitud creada...',
        ok: true,
        solicitud: crearSolicitud,
      })
    } catch (error) {
      enviarError(res, error)
    }
  },
};
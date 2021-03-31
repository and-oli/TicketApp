const ModuloSolicitud = require('../models/Solicitud');
const Usuario = require('../models/Usuario').modelo;
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
      const solicitudes = await Solicitud.find({}).populate('refCliente');
      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes,
      });
    } catch (error) {
      enviarError(res, error);
    }
  },

  getSoliUsuario: async function (req, res) {
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

  getSoliNumero: async function (req, res) {
    try {
      const solicitudesPorId = await Solicitud.find({ idSolicitud: req.params.idSolicitud })
      .populate(['refCliente', 'refUsuarioAsignado'])
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

  postSolicitud: async function (req, res) {
    const fecha = new Date()
    try {
      const idSolicitud = await Solicitud.find({})
      const newSolicitud = new Solicitud()
      newSolicitud.idSolicitud = idSolicitud.length + 1;
      newSolicitud.resumen = req.body.resumen;
      newSolicitud.desripcion = req.body.descripcion;
      newSolicitud.prioridad = req.body.prioridad;
      newSolicitud.fechaHora = fecha.getDay() + '/' + fecha.getMonth() + '/' + fecha.getFullYear() + '     ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
      newSolicitud.estado = 'Sin asignar (abierta)';
      newSolicitud.abierta = true;
      newSolicitud.categoria = req.body.categoria;
      newSolicitud.refUsuarioAsignado = '604e300ca0f34b37c07b7c3a';
      newSolicitud.refCliente = req.body.refCliente;
      newSolicitud.listaIncumbentes = [req.decoded.id];
      await newSolicitud.save()
      res.json({
        mensaje: 'Solicitud enviada...',
        ok: true,
        solicitud: newSolicitud,
      })
    } catch (error) {
      enviarError(res, error)
    }
  },

  postIncumbentes: async function (req, res) {
    try {
      await Solicitud.updateOne({ _id: req.params.idSolicitud }, {
        $addToSet: {
          listaIncumbentes: req.body.nuevosIncumbentes,
        }
      });

    } catch (error) {
      console.error(error)
    };
  },
};
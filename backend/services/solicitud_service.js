const ModuloSecuenciaSolicitudes = require('../models/SecuenciaSolicitudes');
const ModuloSolicitud = require('../models/Solicitud');
const Solicitud = ModuloSolicitud.modelo;
const SecuenciaSolicitudes = ModuloSecuenciaSolicitudes.modelo;

function enviarError(res, error) {
  console.error(error);
  return res.json({
    mensaje: 'Hubo un error...',
    ok: false,
  });
};

module.exports = {

  getSolicitudes: async function (req, res) {
    try {

      const infoFiltro = req.query;
      const filtro = {};

      const regexNumeros = /\d+/g;
      let posiblesIds = [];
      const coincidencias = infoFiltro.texto.match(regexNumeros);
      if (coincidencias) {
        posiblesIds = coincidencias.map(c => Number.parseInt(c));
      }

      if (infoFiltro.estado) {
        filtro.estado = { $regex: infoFiltro.estado, $options: 'i' };
      };

      if (infoFiltro.texto) {
        filtro.resumen = { $regex: infoFiltro.texto, $options: 'i' };
      };

      const solicitudes = await Solicitud.aggregate([
        {
          $match: {
            $or: [
              filtro,
              {
                idSolicitud: {
                  $in: posiblesIds
                },
              }
            ]
          },
        },

        {
          $lookup: {
            from: 'clientes',
            localField: 'refCliente',
            foreignField: '_id',
            as: 'cliente',
          },
        },
        {
          $lookup: {
            from: 'usuarios',
            localField: 'refUsuarioSolicitante',
            foreignField: '_id',
            as: 'usuarioSolicitante',
          },
        },
        { $sort: { idSolicitud: -1 } }
      ]);

      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes,
      });
    } catch (error) {
      enviarError(res, error);
    };
  },

  getSoliUsuario: async function (req, res) {
    try {
      const solicitudesPorUsuario = await Solicitud.find({ idUsuarioMongo: req.params.idUsuarioMongo })
        .populate('idUsuarioMongo');
      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes: solicitudesPorUsuario,
      });
    } catch (error) {
      enviarError(res, error);
    };
  },

  getSoliNumero: async function (req, res) {
    try {
      const solicitudesPorId = await Solicitud.find({ idSolicitud: req.params.idSolicitud })
        .populate('refUsuarioAsignado', ['name', 'role'])
        .populate('refCliente')
        .populate(
          'refUsuarioSolicitante',
          ['name', 'email']
        );

      if (solicitudesPorId.length === 0) {
        res.json({
          mensaje: `No se encontraron solicitudes con ese id: ${req.params.idSolicitud}`,
          ok: false,
        });
      } else {
        res.json({
          mensaje: 'Solicitud exitosa...',
          ok: true,
          solicitud: solicitudesPorId[0],
        });
      };
    } catch (error) {
      enviarError(res, error);
    };
  },

  postSolicitud: async function (req, res) {
    const fecha = new Date();
    try {
      const secuenciaExiste = await SecuenciaSolicitudes.countDocuments({});
      if (!secuenciaExiste) {
        // No hay datos en la colección de secuencia
        const nuevaSecuencia = new SecuenciaSolicitudes();
        nuevaSecuencia.secuencia = 0;
        nuevaSecuencia.id = 0;
        await nuevaSecuencia.save()
      }
      const secuencia = await SecuenciaSolicitudes.findOneAndUpdate(
        { id: 0 },
        { $inc: { secuencia: 1 } },
      );

      const newSolicitud = new Solicitud()
      newSolicitud.idSolicitud = secuencia.secuencia;
      newSolicitud.resumen = req.body.resumen;
      newSolicitud.descripcion = req.body.descripcion;
      newSolicitud.prioridad = req.body.prioridad;
      newSolicitud.fechaHora = fecha.getDay() + '/' + fecha.getMonth() + '/' + fecha.getFullYear() + '     ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
      newSolicitud.estado = 'Sin asignar (abierta)';
      newSolicitud.abierta = true;
      newSolicitud.categoria = req.body.categoria;
      newSolicitud.refUsuarioAsignado = '604e300ca0f34b37c07b7c3a';
      newSolicitud.refCliente = req.body.refCliente;
      newSolicitud.refUsuarioSolicitante = req.decoded.id;
      newSolicitud.listaIncumbentes = [req.decoded.id];
      await newSolicitud.save();
      res.json({
        mensaje: 'Solicitud enviada...',
        ok: true,
        solicitud: newSolicitud,
      });
    } catch (error) {
      enviarError(res, error);
    };
  },

  postIncumbentes: async function (req, res) {
    try {
      await Solicitud.updateOne({ _id: req.params.idSolicitud }, {
        $addToSet: {
          listaIncumbentes: req.body.nuevosIncumbentes,
        }
      });

    } catch (error) {
      console.error(error);
    };
  },
};
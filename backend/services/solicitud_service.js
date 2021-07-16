const ModuloSecuenciaSolicitudes = require('../models/SecuenciaSolicitudes');
const ModuloSolicitud = require('../models/Solicitud');
const estadoPredeterminado = require('../data/estado.json').sinAsignar
const Solicitud = ModuloSolicitud.modelo;
const SecuenciaSolicitudes = ModuloSecuenciaSolicitudes.modelo;
const mongoose = require('mongoose')
function enviarError(res, error) {
  console.error(error.stack);
  return res.json({
    mensaje: 'Hubo un error...',
    ok: false,
  });
};

module.exports = {

  getSolicitudes: async function (req, res) {
    try {
      const userInfo = req.decoded;
      const infoFiltro = req.query;
      let filtroEstado;
      let filtroResumen;
      let filtroUsuario = [];

      if (userInfo.role !== 'ADMINISTRADOR') {
        filtroUsuario = [
          {refUsuarioSolicitante: mongoose.Types.ObjectId(userInfo.id)},
          {dueno: mongoose.Types.ObjectId(userInfo.id)},
          {listaIncumbentes: mongoose.Types.ObjectId(userInfo.id)},
        ]
      }
      const regexNumeros = /\d+/g;
      let posiblesIds = [];
      const coincidencias = infoFiltro.texto.match(regexNumeros);
      let ordenResultado = { idSolicitud: -1 };

      if (coincidencias) {
        posiblesIds = coincidencias.map(c => Number.parseInt(c));
      }

      if (infoFiltro.estado) {
        filtroEstado = { estado: infoFiltro.estado};
      };

      if (infoFiltro.texto) {
        filtroResumen = { resumen: {$regex: infoFiltro.texto }};
      };

      if (infoFiltro.ordenarPor) {
        ordenResultado = {};
        ordenResultado[infoFiltro.ordenarPor] = infoFiltro.orden === 'asc' ? 1 : -1;
      };
      const cantidad = Number(infoFiltro.cantidad);
      const pagina = Number(infoFiltro.pagina);
      const filtroAgregacion = {
        $match: {
          $or: [
            filtroResumen,
            {
              idSolicitud: {
                $in: posiblesIds
              },
            }
          ],
          $or: filtroUsuario,
          ...filtroEstado
        },
      };
      const resultadoCuenta = await Solicitud.aggregate([
        filtroAgregacion,
        { $count: "cuenta" },
      ]);
      let cuenta = 0;
      if (resultadoCuenta[0]) {
        cuenta = resultadoCuenta[0].cuenta;
      }

      const solicitudes = await Solicitud.aggregate([
        filtroAgregacion,
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
          }
        },
        { $sort: ordenResultado },
        { $skip: pagina * cantidad },
        { $limit: cantidad },
      ]);
      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes,
        cuenta,
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
        .populate('dueno', ['name', 'role'])
        .populate('refCliente')
        .populate('listaIncumbentes', ['name'])
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
    const notificacion = {};
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

      const newSolicitud = new Solicitud();
      newSolicitud.idSolicitud = secuencia.secuencia;
      newSolicitud.resumen = req.body.resumen;
      newSolicitud.descripcion = req.body.descripcion;
      newSolicitud.prioridad = req.body.prioridad;
      newSolicitud.fechaHora = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear() + '   ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
      newSolicitud.estado = estadoPredeterminado;
      newSolicitud.abierta = true;
      newSolicitud.categoria = req.body.categoria;
      newSolicitud.refCliente = req.body.refCliente;
      newSolicitud.refUsuarioSolicitante = req.decoded.id;
      newSolicitud.listaIncumbentes = req.decoded.id
      const createSolicitud = await Solicitud.create(newSolicitud);
      const resCreateSolicitud = await createSolicitud
        .populate('dueno', 'subscription')
        .populate('refUsuarioSolicitante', 'name').execPopulate()
      notificacion.title = `Nueva solicitud #${resCreateSolicitud.idSolicitud}`
      notificacion.text = `${resCreateSolicitud.refUsuarioSolicitante.name}: ${resCreateSolicitud.resumen}`
      notificacion.refUsuario = resCreateSolicitud.dueno
      res.json({
        mensaje: 'Solicitud enviada...',
        ok: true,
        solicitud: resCreateSolicitud,
        notificacion
      });
    } catch (error) {
      enviarError(res, error);
    };
  },
};
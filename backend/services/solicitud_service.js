const ModuloSecuenciaSolicitudes = require('../models/SecuenciaSolicitudes');
const ModuloSolicitud = require('../models/Solicitud');
const categorias = require('../data/categorias_solicitud.json');
const prioridad = require('../data/prioridad.json');
const requerimiento = require('../data/tipo_de_requerimiento.json')
const estadoPredeterminado = require('../data/estado.json').sinAsignar
const Solicitud = ModuloSolicitud.modelo;
const SecuenciaSolicitudes = ModuloSecuenciaSolicitudes.modelo;

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

      const infoFiltro = req.query;
      const filtro = {};

      const regexNumeros = /\d+/g;
      let posiblesIds = [];
      const coincidencias = infoFiltro.texto.match(regexNumeros);
      let ordenResultado = { idSolicitud: -1 };

      if (coincidencias) {
        posiblesIds = coincidencias.map(c => Number.parseInt(c));
      }

      if (infoFiltro.estado) {
        filtro.estado = { $regex: infoFiltro.estado, $options: 'i' };
      };

      if (infoFiltro.texto) {
        filtro.resumen = { $regex: infoFiltro.texto, $options: 'i' };
      };

      if (infoFiltro.ordenarPor) {
        ordenResultado = {};
        ordenResultado[infoFiltro.ordenarPor] = infoFiltro.orden === 'asc' ? 1 : -1;
      };

      const cantidad = Number(infoFiltro.cantidad);
      const pagina = Number(infoFiltro.pagina);
      const resultadoCuenta = await Solicitud.aggregate([
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
        { $count: "cuenta" },
      ]);
      const cuenta = resultadoCuenta[0].cuenta;
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
            let: { ref: '$refUsuarioSolicitante' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$$ref', '$_id'] }
                    ]
                  }
                }
              },
              {
                $project: {
                  name: 1,
                }
              }
            ],
            as: 'usuarioSolicitante'
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

  getConstantes: async function (res) {
      res.json({
        categorias,
        prioridad,
        requerimiento
      })
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
        console.log(secuencia.secuencia)
      const newSolicitud = new Solicitud()
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
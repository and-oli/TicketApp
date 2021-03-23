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
    try {
      const crearSolicitud = await Solicitud.create({
        idSolicitud: req.body.idSolicitud,
        resumen: req.body.resumen,
        desripcion: req.body.descripcion,
        fechaHora: new Date(),
        estado: 'Sin asignar (abierta)',
        abierta:true,
        categoria: req.body.categoria,
        refUsuarioAsignado: req.body.refUsuarioAsignado,
        refCliente: req.body.refCliente,
        usuariosIncumbentes:{refUsuario:[req.decoded.id]}
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
  
  postIncumbentes:async function(req, res){
    try{
      await Solicitud.updateOne({_id:req.params.idSolicitud},{
        $addToSet:{
      listaIncumbentes:req.body.nuevosIncumbentes,
      }
    });
    
    } catch (error) {
      console.error(error)
    };
  },
};
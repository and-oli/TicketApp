const ModuloSolicitud = require('../models/Solicitud');
const Solicitud = ModuloSolicitud.modelo;
const ModuloUsuarios = require('../models/Usuario');
const Usuarios = ModuloUsuarios.modelo;

module.exports = {
  getIncumbentes: async function (req, res) {
    const infoIncumbente = req.params.idSolicitud;
    try {
      const solicitud = await Solicitud.findOne({
        idSolicitud: infoIncumbente
      }).populate('listaIncumbentes', 'username')
      res.json({ lista: solicitud.listaIncumbentes, ok: true });
    } catch (err) {
      console.error(err)
    }
  },

  getPosiblesIncumbentes: async function (req, res) {
    try {
      const posiblesUsuarios = await Usuarios.aggregate([
        {
          $project: {
            username: 1
          }
        }
      ]);
      res.json({ ok: true, listaPosiblesUsuarios: posiblesUsuarios })
    } catch (err) {
      console.error(err)
    }
  },

  actualizarIncumbentes: async function (req, res) {
    const infoIncumbentes = req.body;
    const actualizacionIncumbente = {
      listaIncumbentes:
        infoIncumbentes.nuevaLista
    };
    try {
      await Solicitud.findOneAndUpdate({
        idSolicitud:
          infoIncumbentes.idSolicitud
      }, actualizacionIncumbente
      )
      res.json({ ok: true, mensaje: 'actualizada con exito' })
    } catch (err) {
      console.log(err)
    }
  },

  postIncumbentes: async function (req, res) {
    const infoIncumbente = req.body;
    const nuevoIncumbente = {};
    try {
      nuevoIncumbente.$addToSet = {
        listaIncumbentes:
          infoIncumbente.refIncumbente
      }

      const nuevaListaIncumbentes = await Solicitud.updateOne({
        idSolicitud: infoIncumbente.solicitud
      }, nuevoIncumbente)
        .populate('listaIncumbentes', 'name');

      if (nuevaListaIncumbentes.nModified) {
        res.json({ nuevaListaIncumbentes, mensaje: 'Se agrego incumbente exitosamente', ok: true });
      } else {
        res.json({ nuevaListaIncumbentes, mensaje: 'El usuario ya esta en la lista', ok: false });
      }

    } catch (err) {
      console.log(err)
      res.json({ mensaje: 'El usuario no agregado intentelo de nuevo', ok: false });
    }
  },
};
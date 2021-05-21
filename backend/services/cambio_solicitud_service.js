const ModuloCambiosSolicitud = require('../models/CambioSolicitud');
const CambiosSolicitud = ModuloCambiosSolicitud.modelo;
const UsuarioSchema = require('../models/Usuario');
const Usuario = UsuarioSchema.modelo;
const Solicitud = require('../models/Solicitud').modelo;
const Notificacion = require('../models/Notification').modelo;
const sendNotification = require('../utils/sendNotification').notification;
const credencialesDeCorreo = require('../config/config');
const estados = require('../data/estado.json')
const fetch = require('node-fetch');
const mongoose = require('mongoose')

module.exports = {

  getCambiosPorSolicitud: async function (req, res) {
    const cambios = await CambiosSolicitud.aggregate([
      {
        $match: {
          refSolicitud: mongoose.Types.ObjectId(req.params.idSolicitud)
        }
      },
      {
        $lookup: {
          from: 'usuarios',
          let: { ref: '$refUsuario' },
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
                role: 1,
                subscription: 1,
              }
            }
          ],
          as: 'refUsuario'
        }
      },
      {
        $lookup: {
          from: 'archivos',
          localField: 'archivos',
          foreignField: '_id',
          as: 'archivos',
        },
      },
    ])
    if (!cambios) {
      res.json({ mensaje: 'No hay cambios', ok: false });
    } else {
      res.json({ mensaje: 'Cambios', cambios, ok: true })
    };
  },

  postFile: async function (req, res) {
    res.json({
      ruta: 'https://www.muycomputer.com/wp-content/uploads/2016/07/portada.jpg'
    })
  },

  cambio: async function (req, res) {

    const cambios = req.body;
    const resultadoSolicitud = {};
    const fecha = new Date()

    if (cambios.dueno) {
      try {
        resultadoSolicitud.dueno = cambios.dueno;
        resultadoSolicitud.$addToSet = {
          listaIncumbentes: {
            $each: [cambios.dueno]
          }
        };
        await Notificacion.create({ refUsuario: cambios.dueno, payload: 'A sido asignado a la solicitud' });
      } catch (err) {
        console.error(err)
      };
      resultadoSolicitud.estado = estados.asignada;
      cambios.estado = estados.asignada;
    }

    if (cambios.abierta !== undefined) {
      resultadoSolicitud.abierta = cambios.abierta;
      resultadoSolicitud.estado = estados.resuelta;
      cambios.estado = estados.resuelta;
    };
    cambios.refUsuario = req.decoded.id

    await Solicitud.updateOne({ idSolicitud: req.params.idSolicitud }, resultadoSolicitud)
    const cambiosSolicitud = new CambiosSolicitud();

    for (let llave in cambios) {
      if (cambios[llave] !== "") {
        cambiosSolicitud[llave] = cambios[llave];
      }
    }
    cambiosSolicitud.fechaHora = (
      fecha.getDate() +
      '/' +
      (fecha.getMonth() + 1) +
      "/" +
      fecha.getFullYear() +
      "  " +
      fecha.getHours() +
      ":" +
      fecha.getMinutes() +
      ":" +
      fecha.getSeconds()
    );

    const solicitud = await Solicitud.findOne({ idSolicitud: req.params.idSolicitud })
      .populate('listaIncumbentes', 'email')
      .populate('dueno', 'subscription')
      .select('idSolicitud');
    const subscription = solicitud.dueno.subscription[0];
    if (subscription) {
      sendNotification(...subscription, cambios.titulo, { TTL: 0 })
    }
    // await this.enviarCorreo(req, resultadoSolicitud, cambios.nota, solicitud.listaIncumbentes, solicitud.idSolicitud);
    try {

      await cambiosSolicitud.save();
      res.json({
        mensaje: 'Cambios guardados.',
        ok: true,
      });
    } catch (err) {
      console.error(err);
      res.json({
        mensaje: 'Hubo un error.',
        ok: false,
      });
    };
  },

  enviarCorreo: async function (req, cambios, nota, incumbentes, idSolicitud) {
    try {
      const emails = incumbentes.map(usuario => usuario.email);
      const { emailjsUserId, emailjsTemplateId, emailjsServiceId } = credencialesDeCorreo;
      data = {
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsUserId,
        template_params: {
          'email': emails[0],
          'title': 'Hubo un cambio en la solicitud:',
          'nota': nota,
          'cambios': Object.values(cambios),
          'bcc': emails
        }
      };

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        contentType: 'application/json'
      });
    } catch (error) {
      console.log(error);
    };
  },
}
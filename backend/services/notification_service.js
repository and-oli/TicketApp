const Notificacion = require('../models/Notification').modelo;
const webPush = require('web-push');

module.exports = {
  getNotifications: async function (req, res) {
    const { id, subscription, } = req.decoded;
    try {
      const notificaciones = await Notificacion.find({ refUsuario: `${id}` }).sort({_id: -1});
      if (notificaciones) {
        notificaciones.map(async (notific) => {
          await webPush.sendNotification(subscription, notific.payload, { TTL: 0 });
        });
      }
      res.json({ ok: true, notificaciones })
    } catch (err) {
      console.log(err)
      res.json({ ok: false, mensaje: 'La notificacion no pudo ser enviada.' })
    }
  },

  cambioNotificaciones: async function (req, res) {
    const { solicitud, notificacion } = req.body;
    try {
      const notificationsUsers = [];
      const tituloNotificacion = `Nuevo cambio en la solicitud # ${solicitud.idSolicitud}`;
      const link = `/detalle-solicitud/?id_solicitud=${solicitud.idSolicitud}`
      solicitud.listaIncumbentes.map(user => {
        const notificar = {
          refUsuario: user._id,
          payload: tituloNotificacion,
          titulo: tituloNotificacion,
          info: notificacion.info,
          url: link
        }
        notificationsUsers.push(notificar);
      })
      await Notificacion.create(notificationsUsers);
      solicitud.listaIncumbentes.map(async (sups) => {
        if (sups.subscription[0]) {
          await webPush.sendNotification(...sups.subscription[0], `Nuevo cambio en la solicitud # ${solicitud.idSolicitud}`, { TTL: 0 });
        }
      })
    } catch (err) {
      if (err.statusCode === 401) {
        console.log('Notificacion no enviada')
      } else {
        console.error(err)
      }
    }
    res.json({ ok: true });
  },

  solicitudNotificaciones: async function (req, res) {
    const { solicitud, notificacion } = req.body;
    const notificar = {
      payload: notificacion.titulo,
      titulo: notificacion.titulo,
      info: notificacion.info,
      refUsuario: notificacion.refUsuario,
      url: `/detalle-solicitud/?id_solicitud=${solicitud.idSolicitud}`
    }
    try {
      await Notificacion.create(notificar);
      await webPush.sendNotification(...solicitud.dueno.subscription[0], `Nueva solicitud # ${solicitud.idSolicitud}\n${solicitud.refUsuarioSolicitante.name}: ${solicitud.resumen}`, { TTL: 0 });
    } catch (err) {
      if (err.statusCode === 401) {
        console.log('Notificacion no enviada')
      } else {
        console.error(err)
      }
    }

    res.json({ ok: true })
  }
};
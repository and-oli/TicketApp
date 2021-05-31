const Notificacion = require('../models/Notification').modelo;
const webPush = require('web-push');

module.exports = {
  getNotifications: async function (req, res) {
    const { id, subscription, } = req.decoded;
    try {
      const notificaciones = await Notificacion.find({ refUsuario: `${id}` }).sort({ _id: -1 });
      if (notificaciones) {
        notificaciones.map(async (notific) => {
          if (notific.visto === false) {
            await webPush.sendNotification(subscription, notific.payload, { TTL: 0 });
          }
        });
        await Notificacion.updateMany({ refUsuario: `${id}`, visto: false }, { visto: true })
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
      const tituloNotificacion = `Nuevo cambio en la solicitud # ${solicitud.idSolicitud}`;
      const link = `/detalle-solicitud/?id_solicitud=${solicitud.idSolicitud}`;
      const createNotifications = await Promise.all(solicitud.listaIncumbentes.map(async (user) => {
        console.log(user)
        const subscription = user.subscription[0]
        const notificar = {
          refUsuario: user._id,
          payload: `${tituloNotificacion}\n${notificacion.info}`,
          titulo: tituloNotificacion,
          info: notificacion.info,
          url: link
        }
        if (subscription) {
          try {
            await webPush.sendNotification(subscription[0], `${tituloNotificacion}\n${notificacion.info}`, { TTL: 0 });
            notificar.visto = true;
          } catch {
            notificar.visto = false;
          }
          console.log(notificar)
          return notificar
        }
      }))

      await Notificacion.create(createNotifications);
    } catch (err) {
      console.error(err)
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
      await webPush.sendNotification(...solicitud.dueno.subscription[0], `Nueva solicitud # ${solicitud.idSolicitud}\n${solicitud.refUsuarioSolicitante.name}: ${solicitud.resumen}`, { TTL: 0 });
      notificar.visto = true
    } catch (err) {
      notificar.visto = false
    }

    await Notificacion.create(notificar);

    res.json({ ok: true })
  }
};
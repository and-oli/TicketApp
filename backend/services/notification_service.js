const Notificacion = require('../models/Notification').modelo;
const webPush = require('web-push');

module.exports = {
  countNotifications: async function (req, res) {
    const { id } = req.decoded;
    try {
      const count = await Notificacion.countDocuments({ refUsuario: id, open: false })
      res.json({ count })
    } catch (err) {
      console.log(err)
    }
  },
  getNotifications: async function (req, res) {
    const { id } = req.decoded;
    try {
      const notificaciones = await Notificacion.find({ refUsuario: `${id}` }).sort({ _id: -1 });
      if (notificaciones) {
        await Notificacion.updateMany({ refUsuario: `${id}`, open: false }, { open: true })
      }
      res.json({ ok: true, notificaciones })
    } catch (err) {
      console.log(err)
    }
  },
  sendNotifications: async function (req, res) {
    const { id, subscription, } = req.decoded;
    try {
      const notificaciones = await Notificacion.find({ refUsuario: `${id}` }).sort({ _id: -1 });
      if (notificaciones) {
        notificaciones.map(async (notific) => {
          if (notific.visto === false) {
            const data = JSON.stringify({
              title: notific.title,
              text: notific.text,
              url: notific.url,
            })
            await webPush.sendNotification(subscription, data, { TTL: 0 });
          }
        });
        await Notificacion.updateMany({ refUsuario: `${id}`, visto: false }, { visto: true }, { new: true });
      }
      res.json({ ok: true })
    } catch (err) {
      console.log(err)
    }
  },

  cambioNotificaciones: async function (req, res) {

    const { solicitud, notificacion } = req.body;
    try {
      const tituloNotificacion = `Nuevo cambio en la solicitud # ${solicitud.idSolicitud}`;
      const link = `/detalle-solicitud/?id_solicitud=${solicitud.idSolicitud}`;
      const createNotifications = await Promise.all(solicitud.listaIncumbentes.map(async (user) => {
        const subscription = user.subscription[0]
        const notificar = {
          refUsuario: user._id,
          text: notificacion.text,
          title: tituloNotificacion,
          url: link,
          open: false,
        }
        if (subscription) {
          try {
            const data = JSON.stringify({
              title: tituloNotificacion,
              text: notificacion.text,
              url: 'http://localhost:3000' + link
            })
            await webPush.sendNotification(subscription[0], data, { TTL: 0 });
            notificar.visto = true;
          } catch {
            notificar.visto = false;
          }
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
      title: notificacion.title,
      text: notificacion.text,
      refUsuario: notificacion.refUsuario,
      url: `/detalle-solicitud/?id_solicitud=${solicitud.idSolicitud}`,
      open: false,
    }
    try {
      const payload = JSON.stringify({
        title: `Nueva solicitud # ${solicitud.idSolicitud}`,
        text: `${solicitud.refUsuarioSolicitante.name}: ${solicitud.resumen}`,
        url: `http://localhost:3000/detalle-solicitud/?id_solicitud=${solicitud.idSolicitud}`,
      })
      await webPush.sendNotification(...solicitud.dueno.subscription[0], payload, { TTL: 0 });
      notificar.visto = true
    } catch (err) {
      notificar.visto = false
    }

    await Notificacion.create(notificar);

    res.json({ ok: true })
  }
};
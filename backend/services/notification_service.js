const Notificacion = require('../models/Notification').modelo;
const webPush = require('web-push');

module.exports = {
  getNotifications: async function (req, res) {
    const { id, subscription, } = req.decoded;
    try {
      const notificaciones = await Notificacion.find({ refUsuario: `${id}` });
      if (notificaciones) {
        notificaciones.map(async (notific) => {
          await webPush.sendNotification(subscription, notific.payload, { TTL: 0 });
        });
      }
      res.json({ ok: true, notificaciones })
    } catch (err) {
      console.log(err)
      res.json({ ok: false, mensaje: 'La notificacion no pudi ser enviada.' })
    }
  },

  cambioNotificaciones: async function (req, res) {
    const infoUser = req.body;
    try {
      const notificationsUsers = [];
      infoUser.map(user => {
        notificationsUsers.push({ refUsuario: user._id, payload: 'Nuevo cambio en la solicitud.' });
      })
      await Notificacion.create(notificationsUsers);
      infoUser.map(async (sups) => {
        if (sups.subscription[0]) {
          await webPush.sendNotification(...sups.subscription[0], 'Nuevo cambio en la solicitud.', { TTL: 0 });
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
    const { subscription, _id } = req.body;
    try {
      await Notificacion.create({ refUsuario: _id, payload: 'Nueva solicitud.' });
      await webPush.sendNotification(...subscription[0], 'Nueva solicitud.', { TTL: 0 });
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
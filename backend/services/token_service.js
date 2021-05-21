const ModuloUsuario = require('../models/Usuario');
const Usuario = ModuloUsuario.modelo;
const Notificaciones = require('../models/Notification').modelo;
const jwt = require('jsonwebtoken');const webPush = require('web-push');
const secretKey = require('../config/config').secret
const roles = require('../data/roles.json')

module.exports = {
  checkTokenAdmin: function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          res.status(403).send({ success: false, message: 'Error de autenticación, por favor refresque la aplicación.', });
        } else {
          if (decoded.role !== roles.administrador) {
            res.status(403).send({
              success: false,
              message: 'No tiene permiso para realizar esta acción.',
            });
          } else {
            req.decoded = decoded;
            next();
          };
        };
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'No tiene permiso para realizar esta acción.',
      });
    };
  },

  checkToken: function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          console.log(err)
          res.status(403).send({ success: false, message: 'Error de autenticación, por favor refresque la aplicación.', });
        } else {
          req.decoded = decoded;
          next();
        };
      });
    } else {
      res.status(403).send({
        success: false,
        message: 'No tiene permiso para realizar esta acción.',
      });
    };
  },

  authorizeUser: async function (user, res) {
    async function verificarNotificaciones(refUser){
      try {
        const verificacionNotificaciones = await Notificaciones.find({refUsuario: refUser})
        if(verificacionNotificaciones) {
          verificacionNotificaciones.map(async (notificaciones) => {
            await webPush.sendNotification(user.subscription, notificaciones.payload, {TTL:0});
          });
        }
      } catch(err) {
        console.log(err)
      }
    }
    try {
      const userInfo = await Usuario.findOneAndUpdate({ username: user.username }, {subscription: {...user.subscription}})
        .select('_id name username password role')
      const userAuthorize = userInfo;
      if (!userAuthorize) {
        res.json({ mensaje: 'Usuario incorrecto', ok: false });
      } else {
        const password = userAuthorize.comparePassword(user.password);
        if (!password) {
          res.json({ mensaje: 'Contraseña incorrecta', ok: false });
        } else {
          verificarNotificaciones(userAuthorize._id);
          const token = jwt.sign({
            id: userAuthorize._id,
            name: userAuthorize.name,
            username: userAuthorize.username,
            role: userAuthorize.role,
          }, secretKey, { expiresIn: '24h' });
          res.json({
            mensaje: 'Usuario valido',
            idUsuario: userAuthorize.idUser,
            user: userAuthorize.role,
            username: userAuthorize.username,
            token,
            ok: true,
          });
        };
      }
    } catch (err) {
      console.error(err)
      res.json({ mensaje: 'Ocurió un error', ok: false, });
    }
  }
}
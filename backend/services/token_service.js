const ModuloUsuario = require('../models/Usuario');
const Usuario = ModuloUsuario.modelo;
const jwt = require('jsonwebtoken'); 
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
    try {
      const userInfo = await Usuario.findOneAndUpdate({ username: user.username }, { subscription: { ...user.subscription } })
        .select('_id name username password role')
      if (!userInfo) {
        res.json({ mensaje: 'Usuario incorrecto', ok: false });
      } else {
        const password = userInfo.comparePassword(user.password);
        if (!password) {
          res.json({ mensaje: 'Contraseña incorrecta', ok: false });
        } else {
          const token = jwt.sign({
            id: userInfo._id,
            name: userInfo.name,
            username: userInfo.username,
            role: userInfo.role,
            subscription:user.subscription,
          }, secretKey, { expiresIn: '24h' });
          res.json({
            mensaje: `Bienvenido ${userInfo.name}`,
            idUsuario: userInfo._id,
            user: userInfo.role,
            username: userInfo.username,
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
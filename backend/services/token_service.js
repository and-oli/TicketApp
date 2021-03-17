const ModuloUsuario = require('../models/Usuario');
const Usuario = ModuloUsuario.modelo;
const jwt = require('jsonwebtoken');
const secretKey = require('../config/config').secret

module.exports = {
  checkTokenAdmin: function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          res.status(403).send({ success: false, message: 'Error de autenticación, por favor refresque la aplicación.', });
        } else {
          if (decoded.role !== 'ADMINISTRADOR') {
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

  authorizeUser: async function (res, user) {
    try {
      const userInfo = await Usuario.find({ username: user.username })
        .select('_id name username password role')

      if (!userInfo[0]) {
        res.json({ mensaje: 'Usuario incorrecto', ok: false });
      } else {
        const userAuthorize = userInfo[0];
        const password = userAuthorize.comparePassword(user.password);
        if (!password) {
          res.json({ mensaje: 'Contraseña incorrecta', ok: false });
        } else {
          const token = jwt.sign({
            id: userAuthorize._id,
            name: userAuthorize.name,
            username: userAuthorize.username,
            role: userAuthorize.role,
          }, secretKey, { expiresIn: '24h' });
          res.json({
            mensaje: 'Usuario valido',
            idUsuario: userAuthorize.idUser,
            admin: userAuthorize.role === 'ADMINISTRADOR',
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
const ModuloUsuario = require("../models/Usuario");
const Usuario = ModuloUsuario.modelo;
const jwt = require("jsonwebtoken");
const secretKey = require("../config/config").secret

module.exports = {
  checkTokenAdmin: function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          return res.status(403).send({ success: false, message: "Error de autenticación, por favor refresque la aplicación.", });
        } else {
          if (decoded.role !== "ADMINISTRADOR") {
            return res.status(403).send({
              success: false,
              message: "No tiene permiso para realizar esta acción.",
            });
          } else {
            req.decoded = decoded;
            next();
          };
        };
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "No tiene permiso para realizar esta acción.",
      });
    };
  },

  checkToken: function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          return res.status(403).send({ success: false, message: "Error de autenticación, por favor refresque la aplicación.", });
        } else {
          req.decoded = decoded;
          next();
        };
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "No tiene permiso para realizar esta acción.",
      });
    };
  },

  authorizeUser: async function (res, user) {
    return await Usuario.find({ username: user.username })
      .select("idUser name password role")
      .then(function (userInfo) {
        const userAuthorize = userInfo[0];
        if (!userAuthorize) {
          return res.json({ mensaje: "Usuario incorrecto", ok: false });
        }
        const password = userAuthorize.comparePassword(user.password);
        if (!password) {
          return res.json({ mensaje: "Contraseña incorrecta", ok: false });
        } else {
          const token = jwt.sign({
            id: userAuthorize.idUser,
            name: userAuthorize.name,
            username: userAuthorize.username,
            role: userAuthorize.role,
          }, secretKey, { expiresIn: '24h' });
          res.json({
            mensaje: "Usuario valido",
            idUsuario: userAuthorize.idUser,
            admin: userAuthorize.role === "ADMINISTRADOR",
            username: userAuthorize.username,
            token,
            ok: true,
          });
        };
      })
      .catch((err) => {
        console.error(err)
        res.json({ mensaje: "Ocurió un error", ok: false, });
      });
  }
};
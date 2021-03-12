const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/config").secret

module.exports = {
  checkTokenAdmin: function (req, res, next, admin) {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          return res.status(403).send({ success: false, message: "Error de autenticación, por favor refresque la aplicación.", });
        } else {
          if (admin && decoded.role !== "ADMINISTRADOR") {
            return res.status(403).send({
              success: false,
              message: "No tiene permiso para realizar esta acción.",
            });
          } else {
            req.decoded = decoded;
          };
        };
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "No tiene permiso para realizar esta acción.",
      });
    };
    next();
  },

  checkToken: function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (token) {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          return res.status(403).send({ success: false, message: "Error de autenticación, por favor refresque la aplicación.", });
        } else {
          req.decoded = decoded;
        };
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "No tiene permiso para realizar esta acción.",
      });
    };
    next();
  },

  authorizeUser: async function (res, user) {
    let authorize = await Users.find({ name: user.name })
      .select("idUser name password role")
      .then(function (userInfo) {
        const userAuthorize = userInfo[0];
        let password = userAuthorize.comparePassword(user.password);
        if (!password) {
          res.json({ mensaje: "contraseña incorrecta", ok: false });
        } else {
          var token = jwt.sign({
            id: userAuthorize.idUser,
            name: userAuthorize.name,
            userName: userAuthorize.userName,
            role: userAuthorize.role,
          }, secretKey, { expiresIn: '24h' });
          console.log(token)
          res.json({
            mensaje: "Usuario valido",
            idUsuario: userAuthorize.idUser,
            admin: userAuthorize.role === "ADMINISTRADOR",
            nombre: userAuthorize.name,
            token,
            ok: true,
          });
        };
      })
      .catch((err) => {
        res.json({ mensaje: "Usuario incorrecto", err, ok: false, });
      });
    return authorize;
  }
};
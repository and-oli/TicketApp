const Users = require("../models/users");
const bcrypt = require('bcrypt');

module.exports = {
  postUser: async function (res, user) {
    const newUser = new Users();
    newUser.idUser = user.idUser;
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.role = user.role;
    let userRes = await newUser
      .save()
      .then((user) => res.json({ mensaje: "usuario creado correctamente", user, ok: true }))
      .catch((err) => res.json({ mensaje: "El usuario no pudo ser creado", ok: false })
      );
    return userRes;
  },

  getUser: async function (user) {
    const findUser = await Users.findOne({ name: user.name });
    return findUser;
  },

  updateUser: async function (res, user) {

    const resUser = await this.getUser(user);

    if (!resUser) {
      res.json({ mensaje: "Usuario incorrecto", ok: false });
    } else {
      const validPassword = bcrypt.compareSync(user.password, resUser.password);
      if (!validPassword) {
        res.json({ mensaje: "Contraseña incorrecta", ok: false });
      } else {
        let newPassword = await bcrypt.hash(user.newPassword, 10)
        const actualizado = await Users.updateOne({ name: user.name }, { password: newPassword });
        if (!actualizado) {
          res.json({ mensaje: "La contraseña no pudo ser actualizada", ok: false });
        } else {
          res.json({ mensaje: "la contraseña se actualizo con exito", ok: true });
        };
      };
    };
  }
};
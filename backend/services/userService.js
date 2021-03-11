const Users = require("../models/users");

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
  updateUser: async function (res, user) {
    let userUp = await Users.updateOne(
      { name: user.name },
      { password: user.password }
    )
      .then((user) => res.json({ mensaje: "Usuario actualizado", user, ok: true }))
      .catch((err) => res.json({ mensaje: "el usuario no pudo ser actualizado", ok: false })
      );
    return userUp;
  }
};

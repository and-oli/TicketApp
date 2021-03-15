const ModuloCliente = require("../models/Cliente");
const Cliente = ModuloCliente.modelo;
const ModuloUsuario = require("../models/Usuario");
const Usuario = ModuloUsuario.modelo;
const bcrypt = require('bcrypt');

module.exports = {
  postUser: async function (res, user) {
    try {
      const duplicado = await Usuario.findOne({ $or: [{ username: user.username}, {email: user.email }] });
      if (duplicado) {
        return res.json({ mensaje: "Correo o username no disponible", ok: false })
      }
      if (user.refCLiente){
        // La cuenta de usuario que se intenta agregar es de tipo CLIENTE.
        // Se debe revisar que el cliente exista en la base de datos
        const cliente = await Cliente.findById(user.refCLiente);
        if (!cliente){
          return res.json({ mensaje: "Cliente no existente.", ok: false })
        }
        
      }
      const newUser = new Usuario();
      newUser.name = user.name;
      newUser.email = user.email;
      newUser.username = user.username;
      newUser.password = user.password;
      newUser.role = user.role;
      newUser.refCLiente = user.refCLiente;
      const resultado = await newUser.save();
      return res.json({ mensaje: "Usuario creado correctamente", ok: true })
    } catch (error) {
      console.error(error)
      return res.json({ mensaje: "El usuario no pudo ser creado", ok: false });
    }

  },

  getUser: async function (user) {
    return await Usuario.findOne({ name: user.name });
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
        const actualizado = await Usuario.updateOne({ name: user.name }, { password: newPassword });
        if (!actualizado) {
          res.json({ mensaje: "La contraseña no pudo ser actualizada", ok: false });
        } else {
          res.json({ mensaje: "La contraseña se actualizó con exito", ok: true });
        };
      };
    };
  }
};
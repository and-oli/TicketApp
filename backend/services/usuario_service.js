const ModuloCliente = require('../models/Cliente');
const Cliente = ModuloCliente.modelo;
const ModuloUsuario = require('../models/Usuario');
const Usuario = ModuloUsuario.modelo;
const bcrypt = require('bcrypt');

module.exports = {
  postUser: async function (user, res) {
    try {
      const duplicado = await Usuario.findOne({ $or: [{ username: user.username }, { email: user.email }] });
      if (duplicado) {
        res.json({ mensaje: 'Correo o username no disponible', ok: false })
      }
      if (user.refCLiente) {
        // La cuenta de usuario que se intenta agregar es de tipo CLIENTE.
        // Se debe revisar que el cliente exista en la base de datos
        const cliente = await Cliente.findById(user.refCLiente);
        if (!cliente) {
          res.json({ mensaje: 'Cliente no existente.', ok: false })
        }

      }
      const newUser = new Usuario();
      newUser.name = user.name;
      newUser.email = user.email;
      newUser.username = user.username;
      newUser.password = user.password;
      newUser.role = user.role;
      newUser.refCLiente = user.refCLiente;
      await newUser.save();
      res.json({ mensaje: 'Usuario creado correctamente', ok: true })
    } catch (error) {
      console.error(error)
      res.json({ mensaje: 'El usuario no pudo ser creado', ok: false });
    }

  },

  getUserTecnicos:async function (req, res) {
    const tecnicos = await Usuario.find({});
    if(!tecnicos){
      res.json({ mensaje: 'no hay tecnicos', ok: false });
    } else {
      res.json({ mensaje: 'solicitud exitosa', tecnicos, ok: true });
    }
  },

  getUserByUserName: async function (user) {
    await Usuario.findOne({ name: user.name });
  },

  validUser: async function (user, res, next) {
    const resUser = await this.getUserByUserName(user);
    if (!resUser) {
      res.json({ mensaje: 'Usuario incorrecto', ok: false });
    } else {
      const validPassword = bcrypt.compareSync(user.password, resUser.password);
      if (!validPassword) {
        res.json({ mensaje: 'Contraseña incorrecta', ok: false });
      } else {
        next()
      }
    }
  },

  updatePassword: async function (user, res) {

    const resUser = await this.getUserByUserName(user);

    let newPassword = await bcrypt.hash(user.newPassword, 10)
    const comparar = bcrypt.compareSync(user.newPassword, resUser.password);
    if (!comparar) {
      const actualizado = await Usuario.updateOne({ name: user.name }, { password: newPassword })
      if (!actualizado.nModified) {
        res.json({ mensaje: 'La contraseña no pudo ser actualizada', ok: false });
      } else {
        res.json({ mensaje: 'La contraseña se actualizó con exito', ok: true });
      };
    } else {
      res.json({ mensaje: 'Ingresar contraseña diferente.', ok: false })
    }
  },

  updateEmail: async function (user, res) {
    const resUser = await this.getUserByUserName(user);
    if (!resUser) {
      res.json({ mensaje: 'No se encontro el usuario.' })
    } else {
      let newEmail = await Usuario.updateOne({ name: user.name }, { email: user.newEmail })
      if (!newEmail.nModified) {
        res.json({ mensaje: 'El e-mail no se pudo actualizar.', ok: false });
      } else {
        res.json({ mensaje: 'El e-mail se actualizó con exito', ok: true });
      };

    }
  },

  updateUsername: async function (user, res) {
    const resUser = await this.getUserByUserName(user);
    if (!resUser) {
      res.json({ mensaje: 'No se encontro el usuario.' })
    } else {
      let newUserName = await Usuario.updateOne({ name: user.name }, { username: user.newUserName });
      if (!newUserName.nModified) {
        res.json({ mensaje: 'El nombre de usuario no se pudo actualizar.', ok: false });
      } else {
        res.json({ mensaje: 'El nombre de usuario se actualizó con exito', ok: true });
      };
    }
  },
  getClientes: async function (res) {
    try {
      const clientes = await Cliente.find({})
      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        clientes,
      })
    } catch (error) {
      enviarError(res, error)
    }
  },
};
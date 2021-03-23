const config = require('../config/config');
const ModuloSolicitud = require('../models/Solicitud');
const Solicitud = ModuloSolicitud.modelo;
const UsuarioSchema = require('../models/Usuario');
const Usuario = UsuarioSchema.modelo;
const mongoose = require('mongoose');

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

async function prueba(){
  let idUsuarios = [];
  const refUsuario = await Usuario.find({}).select('_id');
  refUsuario.forEach(element => idUsuarios.push(element._id));
}
prueba()
// 
const mongoose = require('mongoose');
const ModuloArchivos = require('../models/Archivo');
const Archivos = ModuloArchivos.modelo;
const ModuloCambioSolicitud = require('../models/CambioSolicitud');
const CambioSolicitud = ModuloCambioSolicitud.modelo;
const ModuloCliente = require('../models/Cliente');
const Cliente = ModuloCliente.modelo;
const ModuloProyecto = require('../models/Proyecto');
const Proyecto = ModuloProyecto.modelo;
const ModuloSolicitudes = require('../models/Solicitud');
const Solicitud = ModuloSolicitudes.modelo;
const ModuloTareas = require('../models/Tarea');
const Tarea = ModuloTareas.modelo;
const ModuloUsuario = require('../models/Usuario');
const Usuario = ModuloUsuario.modelo;

const config = require('../config/config');
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });


const datosUsuario1 = {
  nombre: 'Jhonny Pineda',
  email: 'japc.9507@gmail.com',
  username: 'jhonny95',
  password: '123456',
  role: 'user',
  refCliente: ''
}

const datosCliente = {
  nombre: 'exito'
}

const datosProyecto = {
  nombre: 'proyecto1',
  refCliente: ''
}

const datosTarea = {
  nombre: 'prueba',
  refProyecto: '',
  refCliente: ''
}
const datosSolicitud = {
  idSolicitud: 1,
  resumen: 'solicitud prueba',
  desripcion: 'solicitud de prueba',
  fechaHora: '',
  estado: 'nueva',
  abierta: true,
  categoria: 'software',
  refUsuarioAsignado: '',
  refCliente: '',
  refTarea: '',
  refProyecto: ''
}

const datosCambioSolicitud = {
  nota: 'hola 123',
  fechaHora: '',
  estado: 'asignada',
  refSolicitud: '',
  refUsuario: '',
  archivos: []
}



function insertToDB() {

  const cliente = await Cliente.create(datosCliente)

  datosProyecto.refCliente = cliente._id;
  const proyecto = await Proyecto.create(datosProyecto)

  datosUsuario1.refCliente = cliente._id;
  const usuario = await Usuario.create(datosUsuario1)

  datosTarea.refProyecto = proyecto._id;
  datosTarea.refCliente = cliente._id;
  const tarea = await Tarea.create(datosTarea)

  datosSolicitud.refUsuarioAsignado = usuario._id;
  datosSolicitud.refCliente = cliente._id;
  datosSolicitud.refTarea = tarea._id;
  datosSolicitud.refProyecto = proyecto._id;
  const solicitudNueva = await Solicitud.create(datosSolicitud)

  datosCambioSolicitud.refSolicitud = solicitudNueva._id;
  datosCambioSolicitud.refUsuario = usuario._id;
  const cambioSolicitud = await CambioSolicitud.create(datosCambioSolicitud)
};

insertToDB();


const ModeloUsuario = require('./models/Usuario').modelo;
const SecuenciaSolicitudes = require('./models/SecuenciaSolicitudes').modelo;
const ModeloSolicitudes = require('./models/Solicitud').modelo;
const ModeloProyecto = require('./models/Proyecto').modelo;
const ModeloCliente = require('./models/Cliente').modelo;
const token = require('./services/token_service').checkToken;
const express = require('express');
const router = express.Router();

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token'
  );
  next();
});


router.post('/newUsuarios', async function (req, res) {
  let user = req.body;
  let users = [];
  let refClientes = [];
  const roles = [
    'Usuario',
    'Tecnico',
    'Especialista'
  ];

  try {
    const count = await ModeloUsuario.count({ name: { $nin: ['Admin'] } });
    const clientes = await ModeloCliente.find({}).select('_id');
    clientes.forEach(ref => refClientes.push(ref._id));

    for (let i = 1; i <= 100; i++) {
      let numeroDeUsuario = count + i;
      let nameUser = user.name + numeroDeUsuario;
      const userInfo = {};
      userInfo.name = nameUser;
      userInfo.nombre = nameUser;
      userInfo.username = nameUser;
      userInfo.refCliente = refClientes[Math.floor(Math.random() * refClientes.length)];
      userInfo.email = `${nameUser}@gmail.com`;
      userInfo.role = roles[Math.floor(Math.random() * roles.length)];
      userInfo.password = nameUser;

      users.push(userInfo);
    };

    await ModeloUsuario.create(users);

    res.json({ mensaje: 'Usuario creado correctamente', ok: true });

  } catch (error) {
    console.error(error);
    res.json({ mensaje: 'El usuario no pudo ser creado', ok: false });
  }
});


router.post('/newCliente', async function (req, res) {
  let clientes = req.body.nombre;
  let clientesACrear = [];
  let newCliente;

  const cuenta = await ModeloCliente.count();

  for (let i = 1; i <= 100; i++) {
    let clienteInfo = {};
    let nombre = i + cuenta;
    clienteInfo.nombre = clientes + nombre;
    clientesACrear.push(clienteInfo);
  }

  try {

    newCliente = await ModeloCliente.create(clientesACrear);

    res.json({
      mensaje: 'El cliente fue creado con exito...',
      ok: true,
      newCliente,
    });

  } catch (error) {
    console.log(error);
  }
});

router.post('/newProyectos', async function (req, res) {
  let proyecto = req.body;
  let newProyectos = [];
  let refClientes = [];
  const count = await ModeloProyecto.count();
  const clientes = await ModeloCliente.find({}).select('_id');

  clientes.forEach(ref => refClientes.push(ref._id));

  for (var i = 1; i <= 100; i++) {
    let numeroCliente = count + i;
    const proyectData = {};

    proyectData.nombre = proyecto.nombre + numeroCliente;
    proyectData.refCliente = refClientes[Math.floor(Math.random() * refClientes.length)];

    newProyectos.push(proyectData);
  }

  try {
    await ModeloProyecto.create(newProyectos);

    res.json({
      mensaje: 'Proyectos creados...',
      ok: true,
    });

  } catch (error) {
    console.log(error);
  }
});


router.post('/newSolicitudes', token, async function (req, res) {
  const fecha = new Date();
  let solicitudes = req.body.solicitudes;
  const documentoDeSolicitudes = [];

  try {
    const secuenciaExiste = await SecuenciaSolicitudes.countDocuments({});
    const idCount = await SecuenciaSolicitudes.find({});
    const count = idCount[0].secuencia;
    const refId = [];

    if (!secuenciaExiste) {
      const nuevaSecuencia = new SecuenciaSolicitudes();
      nuevaSecuencia.secuencia = 0;
      nuevaSecuencia.id = 0;
      await nuevaSecuencia.save();
    }

    const idUser = await ModeloUsuario.find({}, { refCliente: 1 });

    idUser.map(refUser => {
      if (refUser.refCliente) {
        refId.push(refUser);
      };
    });

    solicitudes.map(async (element, i) => {

      refUsuarioRandom = refId[Math.floor(Math.random() * refId.length)];
      let id = count + i;

      element.idSolicitud = id;
      element.resumen = element.resumen + id;
      element.descripcion = element.descripcion + id;
      element.fechaHora = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear() + '  ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
      element.estado = 'Sin asignar (abierta)';
      element.abierta = true;
      element.refCliente = refUsuarioRandom.refCliente;
      element.refUsuarioAsignado = '6081ccc63a676332bc4140a0';
      element.refUsuarioSolicitante = refUsuarioRandom._id;
      element.listaIncumbentes = [refUsuarioRandom._id];
      documentoDeSolicitudes.push(element);

      await SecuenciaSolicitudes.updateOne(
        { id: 0 },
        { $inc: { secuencia: 1 } },
      );
    });

    const newSolicitudes = await ModeloSolicitudes.create(documentoDeSolicitudes);

    res.json({
      mensaje: 'Solicitud enviada...',
      ok: true,
      newSolicitudes,
    });

  } catch (error) {
    console.log(error);
  };
});


router.post('/delete', function (req, res) {
  const collection = req.body.modelo
  const modelos = {
    ModeloUsuario,
    ModeloSolicitudes,
    ModeloProyecto,
    ModeloCliente,
  };

  try {

    collection.map(async (modelo) => {
      if (modelo === 'ModeloSolicitudes') {
        await SecuenciaSolicitudes.updateOne({ secuencia: 1 });
      };

      await modelos[modelo].deleteMany({});
      res.json({ mensaje: `${modelo} fue eliminado con exito` });
    });



  } catch (error) {
    console.log(error);
  };

});

module.exports = router;
const ModeloUsuario = require('./models/Usuario').modelo;
const SecuenciaSolicitudes = require('./models/SecuenciaSolicitudes').modelo;
const ModeloSolicitudes = require('./models/Solicitud').modelo;
const ModeloProyecto = require('./models/Proyecto').modelo;
const ModeloCliente = require('./models/Cliente').modelo;
const ModeloNotificaciones = require('./models/Notification').modelo
const ModeloCambioSolicitudes = require('./models/CambioSolicitud').modelo
const ModeloArchivos = require('./models/Archivo').modelo
const estado = require('./data/estado.json').sinAsignar
const categorias = require('./data/categorias_solicitud.json')
const prioridades = require('./data/prioridad.json')
const config = require('./config/config');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

async function newClient() {
  let clientesACrear = [];
  const cliente = {
    "nombre": "Cliente",
  }
  const cuenta = await ModeloCliente.countDocuments();

  for (let i = 1; i <= 100; i++) {
    let clienteInfo = {};
    let nombre = i + cuenta;
    clienteInfo.nombre = cliente.nombre + nombre;
    clientesACrear.push(clienteInfo);
  }

  try {
    const cantidad = await ModeloCliente.create(clientesACrear);
    console.log(cantidad.length+' Clientes creados')
    return true

  } catch (error) {
    console.log(error);
  }
}

async function newProjects() {
  let proyecto = {
    "nombre": "Proyecto"
  };
  let newProyectos = [];
  let refClientes = [];
  const count = await ModeloProyecto.countDocuments();
  const clientes = await ModeloCliente.find({}).select('_id');

  clientes.forEach(ref => refClientes.push(ref._id));

  for (var i = 1; i <= 200; i++) {
    let numeroCliente = count + i;
    const proyectData = {};

    proyectData.nombre = proyecto.nombre + numeroCliente;
    proyectData.refCliente = refClientes[Math.floor(Math.random() * refClientes.length)];

    newProyectos.push(proyectData);
  }
  try {
    const cantidad = await ModeloProyecto.create(newProyectos);
    console.log(cantidad.length+' Proyectos creados')
    return true

  } catch (error) {
    console.log(error);
  }
}

async function newUsers() {
  let users = [];
  let refClientes = [];
  const user = {
    "name": 'usuario'
  };
  const roles = [
    'Usuario',
    'Tecnico',
    'Especialista'
  ];

  try {
    const count = await ModeloUsuario.countDocuments({ name: { $nin: ['Admin'] } });
    const clientes = await ModeloCliente.find({}).select('_id');
    clientes.forEach(ref => refClientes.push(ref._id));

    if (!count) {
      const admin = {}
      admin.name = 'Admin';
      admin.username = 'Admin';
      admin.password = 'Admin';
      admin.email = 'Admin@gmail.com';
      admin.role = 'ADMINISTRADOR';
      users.push(admin)
    }

    for (let i = 1; i <= 200; i++) {
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

    const cantidad = await ModeloUsuario.create(users);
    console.log(cantidad.length+' Usuarios creadas')
    return true
  } catch (error) {
    console.error(error);
  }
}

async function nuevasSolicitudes() {
  const fecha = new Date();
  const documentoDeSolicitudes = [];
  const categoriaSolicitudes = Object.values(categorias);
  const prioridadSolicitudes = Object.values(prioridades);
  try {
    const secuenciaExiste = await SecuenciaSolicitudes.countDocuments({});

    if (!secuenciaExiste) {
      const nuevaSecuencia = new SecuenciaSolicitudes();
      nuevaSecuencia.secuencia = 1;
      nuevaSecuencia.id = 0;
      await nuevaSecuencia.save();
    }

    const idCount = await SecuenciaSolicitudes.find({});
    const count = idCount[0].secuencia;
    const refId = [];
    const idUser = await ModeloUsuario.find({}, { refCliente: 1, name: 1});
    let refAdmin
    idUser.map(refUser => {
      if(refUser.name === 'Admin') {
        refAdmin = refUser._id
      }
      if (refUser.refCliente) {
        refId.push(refUser);
      };
    });
    const data = {
      "resumen": "Resumen solicitud # ",
      "descripcion": "Descripcion solicitud # ",
    }

    for (let i = 0; i <= 399; i++) {
      const solicitud = {};
      const refUsuarioRandom = refId[Math.floor(Math.random() * refId.length)];
      const categoria = categoriaSolicitudes[Math.floor(Math.random() * categoriaSolicitudes.length)];
      const prioridad = prioridadSolicitudes[Math.floor(Math.random() * prioridadSolicitudes.length)]

      const id = count + i;
      solicitud.idSolicitud = id;
      solicitud.resumen = data.resumen + id;
      solicitud.descripcion = data.descripcion + id;
      solicitud.fechaHora = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear() + '  ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
      solicitud.estado = estado;
      solicitud.abierta = true;
      solicitud.prioridad = prioridad;
      solicitud.categoria = categoria;
      solicitud.dueno = refAdmin;
      solicitud.refCliente = refUsuarioRandom.refCliente;
      solicitud.refUsuarioSolicitante = refUsuarioRandom._id;
      solicitud.listaIncumbentes = [refUsuarioRandom._id, refAdmin];

      documentoDeSolicitudes.push(solicitud);
    }
    await SecuenciaSolicitudes.updateOne(
      { id: 0 },
      { secuencia: count + documentoDeSolicitudes.length },
    );

    const cantidad = await ModeloSolicitudes.create(documentoDeSolicitudes);

    console.log(cantidad.length+' silicitudes creadas')
    return true

  } catch (error) {
    console.log(error);
  };
}

async function deleteColections() {
  const modelos = {
    ModeloUsuario: ModeloUsuario,
    ModeloSolicitudes: ModeloSolicitudes,
    ModeloProyecto: ModeloProyecto,
    ModeloCliente: ModeloCliente,
    ModeloNotificaciones: ModeloNotificaciones,
    ModeloCambioSolicitudes: ModeloCambioSolicitudes,
    ModeloArchivos: ModeloArchivos,
  };
  try {
    for (let llave in modelos) {
      if (llave === 'ModeloSolicitudes') {
        await SecuenciaSolicitudes.updateOne({ secuencia: 1 });
      };
      await modelos[llave].deleteMany({});
      console.log(`${llave} fue eliminado con exito`);
    };
    return true
  } catch (error) {
    console.log(error);
  };

};

async function createDB(deleteAll) {
  try {
    if (deleteAll === 'delete') {
      const deleteDB = await deleteColections()
      if (deleteDB) {
        const clientes = await newClient();
        if (clientes) {
          const users = await newUsers();
          if (users) {
            const projects = await newProjects();
            if (projects) {
              await nuevasSolicitudes()
            }
          }
        }
      }
    } else {
      const clientes = await newClient();
      if (clientes) {
        const users = await newUsers();
        if (users) {
          const projects = await newProjects();
          if (projects) {
            await nuevasSolicitudes()
          }
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
}

createDB(process.argv[2])
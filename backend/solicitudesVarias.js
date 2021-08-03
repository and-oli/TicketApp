const ModeloUsuario = require('./models/Usuario').modulo;
const SecuenciaSolicitudes = require('./models/SecuenciaSolicitudes').modulo;
const ModeloSolicitudes = require('./models/Solicitud').modulo;
const ModeloProyecto = require('./models/Proyecto').modulo;
const ModeloCliente = require('./models/Cliente').modulo;
const ModeloNotificaciones = require('./models/Notification').modulo
const ModeloCambioSolicitudes = require('./models/CambioSolicitud').modulo
const ModeloArchivos = require('./models/Archivo').modulo
const ModeloCategoria = require('./models/Categoria').modulo
const estado = require('./data/estado.json').sinAsignar
const prioridades = require('./data/prioridad.json')
const config = require('./config/config');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
const categorias = [
  "Aires acondicionados",
  "Alquiler",
  "Backup's",
  "Correo electronico",
  "Cuenta de Acceso",
  "Electricidad",
  "General",
  "Gestion documental",
  "Hardware",
  "Infraestructura - Obra civil",
  "Internet",
  "Monitoreo",
  "Programacion de tecnico",
  "Redes de datos",
  "Seguridad Informatica",
  "Software",
  "Synergy",
  "Telefonia",
]

const categoriasDeTicket = [
  "Soporte tecnico"
]
async function categoriasNuevas() {
  const mapeoCategorias = categorias.map((cat) => ({ nombreCategoria: cat }))
  try {
    const crearCategorias = await ModeloCategoria.create(mapeoCategorias);
    if (crearCategorias.length) {
      console.log(crearCategorias.length + 'categorias creadas')
      return true
    }
  } catch (err) {
    console.log(err)
  }

}



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
    console.log(cantidad.length + ' Clientes creados')
    return true

  } catch (error) {
    console.log(error);
  }
}

async function newProjects() {
  let proyecto = {
    "nombre": "Proyecto"
  };
  let newProyectos
  let refClientes = [];
  const clientes = await ModeloCliente.find({}).select('_id');

  clientes.forEach(ref => refClientes.push(ref._id));
  newProyectos = refClientes.map((refCliente, i) => ({
    nombre: proyecto.nombre + (i + 1),
    refCliente: refCliente
  }))

  try {
    const cantidad = await ModeloProyecto.create(newProyectos);
    console.log(cantidad.length + ' Proyectos creados')
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
    console.log(cantidad.length + ' Usuarios creadas')
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
    const idUser = await ModeloUsuario.find({}, { refCliente: 1, name: 1 });
    let refAdmin
    idUser.map(refUser => {
      if (refUser.name === 'Admin') {
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

      const refProyecto = await ModeloProyecto.findOne({ refCliente: mongoose.Types.ObjectId(refUsuarioRandom.refCliente) })
      let refProyectoRandom = refProyecto._id
      if (refProyectoRandom === undefined) {
        refProyectoRandom = refProyecto[Math.floor(Math.random() * refProyecto.length)]
      }
      const id = count + i;
      solicitud.idSolicitud = id;
      solicitud.resumen = data.resumen + id;
      solicitud.descripcion = data.descripcion + id;
      solicitud.fechaHora = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear() + '  ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
      solicitud.estado = estado;
      solicitud.abierta = true;
      solicitud.prioridad = prioridad;
      solicitud.categoria = categoria;
      solicitud.refCliente = refUsuarioRandom.refCliente;
      solicitud.listaIncumbentes = refUsuarioRandom._id;
      solicitud.refUsuarioSolicitante = refUsuarioRandom._id;
      solicitud.refProyecto = refProyectoRandom
      documentoDeSolicitudes.push(solicitud);
    }
    await SecuenciaSolicitudes.updateOne(
      { id: 0 },
      { secuencia: count + documentoDeSolicitudes.length },
    );

    const cantidad = await ModeloSolicitudes.create(documentoDeSolicitudes);

    console.log(cantidad.length + ' silicitudes creadas')
    return true

  } catch (error) {
    console.log(error);
  };
}

async function deleteColections() {
  const modelos = {
    ModeloCategoria: ModeloCategoria,
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
    console.log(error.stack);
  };

};

async function createDB(deleteAll) {
  try {
    if (deleteAll === 'delete') {

      const deleteDB = await deleteColections()
      if (deleteDB) {
        await categoriasNuevas();
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
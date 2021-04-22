const ModuloCambiosSolicitud = require('../models/CambioSolicitud');
const CambiosSolicitud = ModuloCambiosSolicitud.modelo;
const UsuarioSchema = require('../models/Usuario');
const Usuario = UsuarioSchema.modelo;
const Solicitud = require('../models/Solicitud').modelo;
const credencialesDeCorreo = require('../config/config');
const fetch = require('node-fetch');

module.exports = {
  
  getCambiosPorSolicitud: async function (req, res) {

    const cambios = await CambiosSolicitud.find({ refSolicitud: req.params.idSolicitud }).sort({ _id: -1 })
      .populate('refUsuario', ['name', 'role']);

    if (!cambios) {
      res.json({ mensaje: 'No hay cambios', ok: false });
    } else {
      res.json({ mensaje: 'Cambios', cambios, ok: true })
    };
  },

  cambio: async function (req, res) {

    const cambios = req.body;
    const resultadoSolicitud = {};
    const fecha = new Date()

    if (cambios.refUsuarioAsignado) {
      resultadoSolicitud.refUsuarioAsignado = cambios.refUsuarioAsignado;
      resultadoSolicitud.$addToSet = {
        listaIncumbentes: {
          $each: [cambios.refUsuarioAsignado]
        }
      };
      resultadoSolicitud.estado = 'Asignada';
      cambios.estado = 'Asignada';
    }
    if (cambios.abierta !== undefined) {
      resultadoSolicitud.abierta = cambios.abierta;
      resultadoSolicitud.estado = 'Resuelta';
      cambios.estado = 'Resuelta';
    };
    cambios.refUsuario = req.decoded.id

    await Solicitud.updateOne({ idSolicitud: req.params.idSolicitud }, resultadoSolicitud);

    const cambiosSolicitud = new CambiosSolicitud();

    for (let llave in cambios) {
      if (cambios[llave] !== "") {
        cambiosSolicitud[llave] = cambios[llave];
      }
    }
    cambiosSolicitud.fechaHora = (
      fecha.getDate() +
      '/' +
      (fecha.getMonth() + 1) +
      "/" +
      fecha.getFullYear() +
      "  " +
      fecha.getHours() +
      ":" +
      fecha.getMinutes() +
      ":" +
      fecha.getSeconds()
      );
    // await this.enviarCorreo(req, resultadoSolicitud, cambios.nota);
    try {
      await cambiosSolicitud.save();
      res.json({
        mensaje: 'Cambios guardados.',
        ok: true,
      });
    } catch (err) {
      console.error(err);
      res.json({
        mensaje: 'Hubo un error.',
        ok: false,
      });
    };
  },

  enviarCorreo: async function (req, cambios, nota) {
    let incumbentes = [];

    try {
      const solicitud = await Solicitud.findOne({ idSolicitud: req.params.idSolicitud })
        .select('listaIncumbentes');
      incumbentes = solicitud.listaIncumbentes;

      const emailUsuarios = await Usuario.find({ _id: incumbentes }).select('email');
      const emails = emailUsuarios.map(usuario => usuario.email);
      const { emailjsUserId, emailjsTemplateId, emailjsServiceId } = credencialesDeCorreo;

      data = {
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsUserId,
        template_params: {
          'email': emails[0],
          'title': 'Hubo un cambio en la solicitud:',
          'nota': nota,
          'cambios': Object.values(cambios),
          'bcc': emails
        }
      };

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        contentType: 'application/json'
      });
    } catch (error) {
      console.log(error);
    };
  },
}
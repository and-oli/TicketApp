const ModuloCambiosSolicitud = require('../models/CambioSolicitud');
const CambiosSolicitud = ModuloCambiosSolicitud.modelo;
const UsuarioSchema = require('../models/Usuario');
const Usuario = UsuarioSchema.modelo;
const Solicitud = require('../models/Solicitud').modelo;
const credencialesDeCorreo = require('../config/config');
const fetch = require('node-fetch');


module.exports = {
  cambio: async function (req, res) {

    const cambios = req.body

    const resultadoSolicitud = {};
    if (cambios.abierta !== undefined) {
      resultadoSolicitud.abierta = cambios.abierta
    };
    if (cambios.estado) {
      resultadoSolicitud.estado = cambios.estado
    };

    await Solicitud.updateOne({ _id: req.params.idSolicitud }, resultadoSolicitud);

    const cambiosSolicitud = new CambiosSolicitud();

    for (let llave in cambios) {
      if (cambios[llave] !== "") {
        cambiosSolicitud[llave] = cambios[llave];
      }
    }
    await this.enviarCorreo(req, resultadoSolicitud, cambios.nota);

    try {
      await cambiosSolicitud.save()
      res.json({
        mensaje: 'Cambios guardado.',
        ok: true,
      })
    } catch (err) {
      console.error(err);
      res.json({
        mensaje: 'Hubo un error.',
        ok: false,
      })
    }
  },

  enviarCorreo: async function (req, cambios, nota) {
    let incumbentes = [];

    const solicitud = await Solicitud.findOne({ _id: req.params.idSolicitud })
      .select('listaIncumbentes');
    incumbentes = solicitud.listaIncumbentes;

    const emailUsuarios = await Usuario.find({ _id: incumbentes }).select('email');
    const emails = emailUsuarios.map(usuario => usuario.email);
    const { emailjsUserId, emailjsTemplateId, emailjsServiceId } = credencialesDeCorreo

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

    }
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      contentType: 'application/json'
    })
      .catch(error =>
        console.error(error.stack))
  },
}
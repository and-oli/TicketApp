const ModuloCambiosSolicitud = require('../models/Cambio_solicitud');
const CambiosSolicitud = ModuloCambiosSolicitud.modelo;
const ModuloSolicitud = require('../models/Solicitud');
const Solicitud = ModuloSolicitud.modelo;
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario').modelo;
const credencialesDeCorreo = require('../config/config');
const fetch = require('node-fetch');

module.exports = {
  cambio: async function (cambios, res) {
    if (cambios.estado) {
      await Solicitud.updateOne({ _id: cambios.refSolicitud }, { estado: cambios.estado })
    }
    if (cambios.abierta === false) {
      await Solicitud.updateOne({ _id: cambios.refSolicitud }, { abierta: cambios.abierta })
    }

    const cambiosSolicitud = new CambiosSolicitud();

    for (let llave in cambios) {
      if (cambios[llave] !== "") {
        cambiosSolicitud[llave] = cambios[llave];
      }
    }
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

  enviarCorreo: async function (users, res) {
    // const correosUsuarios = await Usuario.find({_id:[users,'604e300ca0f34b37c07b7c3a']}).select('email');
    // const emailPorUsuario = []
    // for(let i = 0; i < correosUsuarios.length; i++){
    //   emailPorUsuario.push(correosUsuarios[i].email)
    // }
    console.log(users)
    const { emailjsUserId, emailjsTemplateId, emailjsServiceId } = credencialesDeCorreo
    data = {
      serviceId: emailjsServiceId,
      templateId: emailjsTemplateId,
      userId: emailjsUserId,
      templateParams: {'email': users.email, 'name': users.name, 'mensaje': users.mensaje },
    }
    console.log(data)
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      contentType: 'application/json'
    })
      .then((ok) => {
        console.log(ok)
        res.json({ mensaje: 'correo enviado' })
      })
      .catch(error =>
        console.error(error.stack))
  },

}
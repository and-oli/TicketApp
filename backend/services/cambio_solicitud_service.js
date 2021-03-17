const ModuloCambiosSolicitud = require('../models/Cambio_solicitud');
const CambiosSolicitud = ModuloCambiosSolicitud.modelo;
const ModuloSolicitud = require('../models/Solicitud');
const Solicitud = ModuloSolicitud.modelo;

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
}
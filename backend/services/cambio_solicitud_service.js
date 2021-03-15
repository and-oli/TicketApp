const ModuloCambioSolicitud = require('../models/CambioSolicitud');
const CambioSolicitud = ModuloCambioSolicitud.modelo;

function enviarError(error) {
  res.json({
    mensaje: 'No se pudo actualizar...',
    ok: false,
  });
  console.log(error);
};

module.exports = {

  postNota: async function (req, res) {
    const nuevaNota = (await CambioSolicitud.create({
      idCambioSolicitud: 1,
      nota: req.body.nota,
      fechaHora: new Date(),
      idSolicitud: req.body.idSolicitud,
    }).then(nota => res.json({
      mensaje: 'Actualización exitosa...',
      ok: true,
      actualizacion: nota,
    })).catch(enviarError)
    )
    return nuevaNota;
  },

};
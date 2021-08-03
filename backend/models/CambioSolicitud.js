const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var CambioSolicitudSchema = new Schema({
    titulo:String,
    nota: String,
    fechaHora: String,
    estado: String,
    refSolicitud: {
        type: Schema.Types.ObjectId,
        ref: 'solicitudes'
    },
    // Referencia al usuario que el cambio
    refUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    archivos: [{
        type: Schema.Types.ObjectId,
        ref: 'archivos'
    }],
});

const nombreModelo = 'cambiosSolicitudes'   

module.exports = {
    schema: CambioSolicitudSchema,
    modulo: mongoose.model(nombreModelo, CambioSolicitudSchema),
    nombreModelo,
};

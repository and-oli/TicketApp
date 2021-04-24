const mongoose = require('mongoose');
const ModuloArchivo = require("./Archivo");
const ArchivoSchema = ModuloArchivo.schema;

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
    archivos: [ArchivoSchema]
});

const nombreModelo = 'cambiosSolicitudes'   

module.exports = {
    schema: CambioSolicitudSchema,
    modelo: mongoose.model(nombreModelo, CambioSolicitudSchema),
    nombreModelo,
};

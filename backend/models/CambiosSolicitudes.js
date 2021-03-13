const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CambiosSolicitudSchema = new Schema({
    idCambioSolicitud: {type:Number,unique:true},
    nota: String,
    fechaHora: Date,
    Estado: String,
    idSolicitud: {
        type: Schema.Types.ObjectId,
        ref: 'solicitudes'
    },
    idUsuarioMongo: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    archivos: [{
        type: Schema.Types.ObjectId,
        ref: 'archivos'
    }]
});

module.exports = CambiosSolicitudSchema;
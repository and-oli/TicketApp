const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TipoActividadSchema = new Schema({
    descripcion: String,
    idTarea: {
        type: Schema.Types.ObjectId,
        ref: 'tiposActividad'
    },
    idSolicitud: {
        type: Schema.Types.ObjectId,
        ref: 'solicitudes'
    },
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    }
})

module.exports = TipoActividadSchema;
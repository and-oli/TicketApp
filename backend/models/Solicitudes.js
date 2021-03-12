const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SolicitudSchema = new Schema({
    idSolicitud:{type:Number, unique:true},
    resumen: String,
    desripcion: String,
    fechaHora: Date,
    estado: String,
    categoria: String,
    idUsuarioMongo: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'clientes'
    },
    idTarea: {
        type: Schema.Types.ObjectId,
        fer: 'tareas'
    },
    idProyecto: {
        type: Schema.Types.ObjectId,
        ref: 'proyectos'
    }
});

module.exports = SolicitudSchema;
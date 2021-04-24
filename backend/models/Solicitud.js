const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SolicitudSchema = new Schema({
    idSolicitud: {type:Number, unique:true},
    resumen: String,
    descripcion: String,
    fechaHora: String,
    estado: String,
    prioridad:String,
    abierta: Boolean,
    categoria: String,
    listaIncumbentes:[{type:Schema.Types.ObjectId, ref:'usuarios', unique:false}],
    refUsuarioSolicitante:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    dueno: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    },
    refCliente: {
        type: Schema.Types.ObjectId,
        ref: 'clientes'
    },
    refTarea: {
        type: Schema.Types.ObjectId,
        fer: 'tareas'
    },
    refProyecto: {
        type: Schema.Types.ObjectId,
        ref: 'proyectos'
    }
});

const nombreModelo = 'solicitudes'   

module.exports = {
    schema: SolicitudSchema,
    modelo: mongoose.model(nombreModelo, SolicitudSchema),
    nombreModelo,
};
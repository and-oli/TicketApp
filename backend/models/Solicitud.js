const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SolicitudSchema = new Schema({
    idSolicitud: Number,
    resumen: String,
    desripcion: String,
    fechaHora: Date,
    estado: String,
    abierta: Boolean,
    categoria: String,
    listaIncumbentes:[{type:String, unique:true, ref:'usuarios'}],
    refUsuarioAsignado: {
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
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TareaSchema = new Schema({
    nombre: String,
    refProyecto: {
        type: Schema.Types.ObjectId,
        ref: 'proyectos'
    },
    refCliente: {
        type: Schema.Types.ObjectId,
        ref: 'clientes'
    },
});

const nombreModelo = 'tareas'   

module.exports = {
    schema: TareaSchema,
    modulo: mongoose.model(nombreModelo, TareaSchema),
    nombreModelo,
};
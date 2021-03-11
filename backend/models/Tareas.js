const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TareaSchema = new Schema({
    idTarea: Number,
    nombre: String,
    idProyecto: {
        type: Schema.Types.ObjectId,
        ref: 'proyectos'
    },
    idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'clientes'
    }
});

module.exports = TareaSchema;
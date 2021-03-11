const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProyectoSchema = new Schema({
    idProyecto: Number,
    nombre: String,
    idCliente: {
        type: Schema.Types.ObjectId,
        ref: 'clientes'
    }
});

module.exports = ProyectoSchema;
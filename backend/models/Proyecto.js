const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProyectoSchema = new Schema({
    nombre: String,
    refCliente: {
        type: Schema.Types.ObjectId,
        ref: 'clientes'
    }
});

const nombreModelo = 'proyectos'   

module.exports = {
    schema: ProyectoSchema,
    modulo: mongoose.model(nombreModelo, ProyectoSchema),
    nombreModelo,
};
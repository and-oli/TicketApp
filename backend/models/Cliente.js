const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ClienteSchema = new Schema({
    nombre: String
});

const nombreModelo = 'clientes'   

module.exports = {
    schema: ClienteSchema,
    modulo: mongoose.model(nombreModelo, ClienteSchema),
    nombreModelo,
};
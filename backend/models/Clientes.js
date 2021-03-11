const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ClienteSchema = new Schema({
    idCliente: Number,
    nombre: String
});

module.exports = ClienteSchema;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ClienteSchema = new Schema({
    idCliente: {type:Number,unique:true},
    nombre: String
});

module.exports = ClienteSchema;
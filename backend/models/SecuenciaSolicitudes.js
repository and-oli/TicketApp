const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var SecuenciaSolicitudesSchema = new Schema({
    secuencia: Number,
    id: Number
});

const nombreModelo = 'cuentaSolicitudes'   

module.exports = {
    schema: SecuenciaSolicitudesSchema,
    modulo: mongoose.model(nombreModelo, SecuenciaSolicitudesSchema),
    nombreModelo,
};
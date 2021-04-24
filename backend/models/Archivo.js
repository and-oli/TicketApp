const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ArchivoSchema = new Schema({
    categoriaArchivo: String,
    nombreArchivo: String,
    urlArchivo: String
});

const nombreModelo = 'archivos'   

module.exports = {
    schema: ArchivoSchema,
    modelo: mongoose.model(nombreModelo, ArchivoSchema),
    nombreModelo,
};

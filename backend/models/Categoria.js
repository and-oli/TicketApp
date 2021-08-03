const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CategoriaSchema = new Schema({
  nombreCategoria: String,
});

const nombreModelo = 'categoria'   

module.exports = {
    schema: CategoriaSchema,
    modulo: mongoose.model(nombreModelo, CategoriaSchema),
    nombreModelo,
};

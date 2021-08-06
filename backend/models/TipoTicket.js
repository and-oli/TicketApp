const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TipoTicketSchema = new Schema({
  nombreCategoriaTicket: String,
});

const nombreModelo = 'TipoTicket'   

module.exports = {
    schema: TipoTicketSchema,
    modulo: mongoose.model(nombreModelo, TipoTicketSchema),
    nombreModelo,
};
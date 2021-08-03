const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TipoTicketSchema = new Schema({
  nombreCategoria: String,
});

const nombreModelo = 'TipoTicket'   

module.exports = {
    schema: TipoTicketSchema,
    modulo: mongoose.model(nombreModelo, TipoTicketSchema),
    nombreModelo,
};
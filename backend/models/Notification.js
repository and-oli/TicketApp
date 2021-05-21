const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    refUsuario:String,
    payload: String
});

const nombreModelo = 'notificaciones'   

module.exports = {
    schema: NotificationSchema,
    modelo: mongoose.model(nombreModelo, NotificationSchema),
    nombreModelo,
};

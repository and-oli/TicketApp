const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    refUsuario:{type:Schema.Types.ObjectId, ref:'usuarios', unique:false},
    payload: String,
    titulo:String,
    info:String,
    url:String,
    visto: Boolean,
});

const nombreModelo = 'notificaciones'   

module.exports = {
    schema: NotificationSchema,
    modelo: mongoose.model(nombreModelo, NotificationSchema),
    nombreModelo,
};

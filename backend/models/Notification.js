const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    refUsuario:{type:Schema.Types.ObjectId, ref:'usuarios', unique:false},
    title:String,
    text:String,
    url:String,
    visto: Boolean,
    open: Boolean,
});

const nombreModelo = 'notificaciones'   

module.exports = {
    schema: NotificationSchema,
    modulo: mongoose.model(nombreModelo, NotificationSchema),
    nombreModelo,
};

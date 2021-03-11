const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ArchivosSchema = new Schema({
    idArchivo: Number,
    idSolicitud: {
        type: Schema.Types.ObjectId,
        ref: 'archivos'
    },
    urlArchivo: URL
});

module.exports = ArchivosSchema;
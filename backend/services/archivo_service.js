const UploadFile = require('../utils/UploadToGCS');
const ModuloArchivo = require('../models/Archivo');
const Archivo = ModuloArchivo.modelo;

module.exports = {

  guardarArchivosDBYGCS: async function (req, res, next) {
    const archivosEntrantes = req.files;
    const archivosAGuardar = [];
    let confirmarPost = true;
    try {
      for (const categoria in archivosEntrantes) {
        const archivosCategoriaActual = archivosEntrantes[categoria];
        //Si la cantidad de archivos es mayor a la permitida rompe el proceso
        if (archivosCategoriaActual.length > 3) {
          confirmarPost = false
          break
        } else {
          for (const archivo of archivosCategoriaActual) {
            const esquemaArchivo = {}
            const nombreOriginal = archivo.originalname;
            const partesNombre = nombreOriginal.split('.');
            const extensionArchivo = partesNombre[partesNombre.length - 1];
            const nombreSinExtension = nombreOriginal.split(`.${extensionArchivo}`)[0];
            const regexNombreConAutoEnumeracion = RegExp(String.raw`${nombreSinExtension}\(\d+\)\.${extensionArchivo}`);
            const resultadoNombre = await Archivo.find({ nombreArchivo: nombreOriginal });
            const resultadosEnumerados = await Archivo.find({ nombreArchivo: { $regex: regexNombreConAutoEnumeracion, $options: 'i' } });
            if (resultadoNombre.length) {
              // Hay archivos en la base de datos con ese nombre (es un nombre duplicado)
              if (!resultadosEnumerados.length) {
                // Es la primera repetición, pues no existe ese nombre con enumeración automática
                // Enumeración automática: nombre con forma <nombre>(número).<extensión> .              
                archivo.originalname = `${nombreSinExtension}(1).${extensionArchivo}`;
              } else {
                // Es por lo menos la segunda repetición, determinar el número a asignar.
                const regexFin = RegExp(String.raw`\((\d+)\)\.${extensionArchivo}`);
                const maximaEnumeracion = resultadosEnumerados
                  .map(archivo =>
                    // Extraer la secuencia asignada a cada archivo.
                    Number.parseInt(regexFin.exec(archivo.nombreArchivo)[1]))
                  .reduce((max, actual) => Math.max(max, actual));
                archivo.originalname = `${nombreSinExtension}(${maximaEnumeracion + 1}).${extensionArchivo}`
              }
            }
            const url = 'https:// ' + archivo.originalname; // await UploadFile.uploadToGCS(archivo, next)
            esquemaArchivo.categoriaArchivo = categoria;
            esquemaArchivo.nombreArchivo = archivo.originalname;
            esquemaArchivo.urlArchivo = url;
            archivosAGuardar.push(esquemaArchivo);
          }
        }
      }
      if (confirmarPost) {
        const resultadoArchivosGuardados = await Archivo.create(archivosAGuardar);
        return res.json({ ok: true, mensaje: 'Operación exitosa', archivos: resultadoArchivosGuardados });
      } else {
        return res.json({ ok: false, mensaje: 'Se excedio el limite de archivos permitidos' });
      }
    } catch (err) {
      console.error(err);
      return res.json({ ok: false, mensaje: 'Ocurrió un error.' })
    }
  },
}
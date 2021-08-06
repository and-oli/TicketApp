const TipoTicketSchema = require('../models/TipoTicket');
const ModuloTipoTicket = TipoTicketSchema.modulo;

const confirmarRepetido = async (nombre) => {
  const confirmacion = await ModuloTipoTicket.find({ nombreCategoriaTicket: nombre });
  if (confirmacion.length) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getCategorias: async (req, res) => {
    try {
      const categorias = await ModuloTipoTicket.find({});
      res.json({ ok: true, categorias });
    } catch (err) {
      console.log(err);
      res.json({ ok: false, mensaje: 'hubo un error' });
    }
  },

  postCategorias: async (req, res) => {
    const nuevaCategoria = req.body.nombreCategoriaTicket;
    try {
      const repetido = await confirmarRepetido(nuevaCategoria);
      if (repetido) {
        res.json({ ok: false, mensaje: 'La categoria ya existe' });
      } else {
        await ModuloTipoTicket.create({ nombreCategoriaTicket: nuevaCategoria });
        res.json({ ok: true, mensaje: 'Nueva categoria agregada' });
      }
    } catch (err) {
      console.log(err);
      res.json({ ok: false, mensaje: 'la categoria no pudo ser agregada' });
    }
  },

  editarCategoria: async (req, res) => {
    const informacionCategoria = req.body;
    try {
      const repetido = await confirmarRepetido(informacionCategoria.nuevoNombreCategoria);
      if (!repetido) {
        await ModuloTipoTicket.updateOne(
          { _id: informacionCategoria.id },
          { nombreCategoriaTicket: informacionCategoria.nuevoNombreCategoria }
        );
        res.json({ ok: true, mensaje: 'Categoria actualizada con exito' });
      } else {
        res.json({ ok: false, mensaje: 'La categoria ya existe' })
      }
    } catch (err) {
      console.log(err);
      res.json({ ok: false, mensaje: 'La categoria no pudo ser editada' })
    }
  },

}
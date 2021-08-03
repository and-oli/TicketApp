const CategoriaSchema = require('../models/Categoria');
const ModuloCategoria = CategoriaSchema.modulo;

const confirmarRepetido = async (nombre) => {
  const confirmacion = await ModuloCategoria.find({ nombreCategoria: nombre });
  if (confirmacion.length) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getCategorias: async (req, res) => {
    try {
      const categorias = await ModuloCategoria.find({});
      res.json({ ok: true, categorias });
    } catch (err) {
      console.log(err);
      res.json({ ok: false, mensaje: 'hubo un error' });
    }
  },

  postCategorias: async (req, res) => {
    const nuevaCategoria = req.body.nombreNuevaCategoria;
    try {
      const repetido = await confirmarRepetido(nuevaCategoria);
      if (repetido) {
        res.json({ ok: false, mensaje: 'La categoria ya existe' });
      } else {
        await ModuloCategoria.create({ nombreCategoria: nuevaCategoria });
        res.json({ ok: true, mensaje: 'Nueva categoria' });
      }
    } catch (err) {
      console.log(err);
      res.json({ ok: false, mensaje: 'hubo un error' });
    }
  },

  editarCategoria: async (req, res) => {
    const informacionCategoria = req.body;
    try {
      const repetido = await confirmarRepetido(informacionCategoria.nuevoNombreCategoria);
      if (!repetido) {
        await ModuloCategoria.updateOne(
          {
            _id: informacionCategoria.id
          },
          {
            nombreCategoria: informacionCategoria.nuevoNombreCategoria
          }
        );
        res.json({ ok: true, mensaje: 'categoria actualizada con exito' });
      } else {
        res.json({ ok: false, mensaje: 'La categoria ya existe' })
      }
    } catch (err) {
      console.log(err);
      res.json({ ok: false, mensaje: 'hubo un error' })
    }
  },

}
const categoriasSolicitud = require('../data/categorias_solicitud.json');
const categoriasDeArchivos = require('../data/categoria_archivos.json');
const estados = require('../data/estado.json');
const prioridad = require('../data/prioridad.json');
const tipoDeRequerimiento = require('../data/tipo_de_requerimiento.json')
const roles = require('../data/roles.json')

module.exports = {
getCategoriasArchivos: async function(res) {
  return res.json(categoriasDeArchivos)
},

getCategriasSolicitud: async function(res) {
  return res.json(categoriasSolicitud)
},

getEstado: async function(res) {
  return res.json(estados)
},

getPrioridad: async function(res) {
  return res.json(prioridad)
},

getRoles: async function(res) {
  return res.json(roles)
},

getTipoDeRequerimiento: async function(res) {
  return res.json(tipoDeRequerimiento)
},
}
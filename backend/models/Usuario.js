const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UsuarioSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  role: String,
  refCliente: {
    type: Schema.Types.ObjectId,
    ref: 'clientes'
  },
});

UsuarioSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified("password")) {
    return next()
  }
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      console.log(err)
      return next()
    }
    user.password = hash
    next()
  })
});

UsuarioSchema.methods.comparePassword = function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password)
};

const nombreModelo = 'usuarios'   

module.exports = {
    schema: UsuarioSchema,
    modelo: mongoose.model(nombreModelo, UsuarioSchema),
    nombreModelo,
};
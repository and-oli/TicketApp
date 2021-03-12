const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var UserSchema = new Schema({
  idUser: { type: Number, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String
});

UserSchema.pre('save', function (next) {
  let user = this
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

UserSchema.methods.comparePassword = function (password) {
  var user = this;
  return bcrypt.compareSync(password, user.password)
};

module.exports = mongoose.model("usuarios", UserSchema);;
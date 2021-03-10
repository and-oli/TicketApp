const Users = require("../models/users");
const jwt = require("jsonwebtoken");
module.exports = {
    postUser: async function (user) {
        const newUser = new Users()
        newUser.idUser = user.idUser;
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.password = user.password;
        newUser.role = user.role;
        let userRes = (await newUser.save()
            .then(user => {
                return { mensaje: "usuario creado correctamente", user, ok: true }
            })
            .catch(err => {
                return { mensaje: "El usuario no pudo ser creado", err, ok: false }
            }))
        return userRes
    },
    updateUser: async function (user) {
        let userUp = (await Users.updateOne({ name: user.name }, { password: user.password })
            .then(user => {
                return { mensaje: "Usuario actualizado", user, ok: true }
            })
            .catch(err => {
                return { mensaje: "el usuario no pudo ser actualizado", err, ok: false }
            }))
        return userUp
    },
    authorizeUser: async function (user) {
        let authorize = (await Users.find({ name: user.name }).select("idUser name password")
            .then(function (userInfo) {
                let password = userInfo[0].comparePassword(user.password)
                if (!password) {
                    return { mensaje: "contraseña incorrecta", ok: false }
                } else {
                    return { mensaje: "Usuario valido", ok: true }
                }
            })
            .catch(err => {
                return { mensaje: "Usuario insorrecto", err, ok: false }
            })
        )
        return authorize
    }

}

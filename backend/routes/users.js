const express = require("express");
const router = express.Router();
const user = require('../services/userService')

router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token');
    next();
});


router.post("/", async function (req, res) {
    try {
        const newUser = await user.postUser(req.body)
        res.json(newUser)
    } catch (err) {
        res.json(newUser)
    }
});

router.post("/editar",async function (req, res) {
    try {
        const updateUser = await user.updateUser(req.body)
        res.json(updateUser)
    } catch (err) {
        res.json(updateUser)
    }
});

router.post("/find",async function (req, res) {
    try{
        const validationUser = await user.authorizeUser(req.body)
        res.json(validationUser)
    } catch(err){
        res.json({mensaje:"hay un error",ok:false})
    }
})

module.exports = router;




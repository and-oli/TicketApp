const express = require("express");
const router = express.Router();
const token = require("../services/token");
const userService = require('../services/userService')
router.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type, Authorization,Accept,x-access-token"
  );
  next();
});

router.post("/", (req, res, next) => token.checkTokenAdmin(req, res, next, true), async function (req, res) {
  const newUser = await userService.postUser(res, req.body);
  return newUser;
});

router.post("/editar", token.checkToken, async function (req, res) {
  const updateUser = await userService.updateUser(res, req.body);
  return updateUser;
});

router.post("/authenticate", async function (req, res) {
  const validationUser = await token.authorizeUser(res, req.body);
  return validationUser;
});

module.exports = router;

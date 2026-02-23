const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { login } = require("../controllers/loginController");
router.post("/register", authController.register);
router.post("/login", login);

module.exports = router;


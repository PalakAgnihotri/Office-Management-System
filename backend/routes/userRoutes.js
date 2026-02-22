const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/employees", verifyToken, isAdmin, userController.getEmployees);
router.get("/clients/all", verifyToken, isAdmin, userController.getClients);
module.exports = router;

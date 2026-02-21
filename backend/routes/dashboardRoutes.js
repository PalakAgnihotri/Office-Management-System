const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Admin Dashboard
router.get("/admin", verifyToken, isAdmin, dashboardController.getAdminDashboard);

// Employee Dashboard
router.get("/employee", verifyToken, dashboardController.getEmployeeDashboard);

module.exports = router;

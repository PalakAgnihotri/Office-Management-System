const express = require("express");
const router = express.Router();
const courierController = require("../controllers/courierController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Create inward entry
router.post("/inward", verifyToken, isAdmin, courierController.createInward);

// Get all inward entries
router.get("/inward", courierController.getAllInward);

// Delete inward
router.delete("/inward/:id", verifyToken, isAdmin, courierController.deleteInward);
// Create outward
router.post("/outward", verifyToken, isAdmin, courierController.createOutward);

// Get outward list
router.get("/outward", verifyToken, courierController.getAllOutward);

// Delete outward
router.delete("/outward/:id", verifyToken, isAdmin, courierController.deleteOutward);

module.exports = router;

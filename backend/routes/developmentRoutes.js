const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const devController = require("../controllers/developmentController");

router.post("/create", verifyToken, devController.createDevelopmentTask);
router.get("/all", verifyToken, devController.getDevelopmentTasks);
router.delete("/:id",verifyToken,devController.deleteDevelopmentTask);
router.put("/:id",verifyToken, devController.updateDevelopmentTask);
module.exports = router;

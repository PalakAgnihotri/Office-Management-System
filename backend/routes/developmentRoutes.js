const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const devController = require("../controllers/developmentController");

router.post("/create", verifyToken, devController.createDevelopmentTask);
router.get("/all", verifyToken, devController.getDevelopmentTasks);
<<<<<<< HEAD
router.delete("/:id",verifyToken,devController.deleteDevelopmentTask);
router.put("/:id",verifyToken, devController.updateDevelopmentTask);
module.exports = router;
=======
router.put("/:id",verifyToken, devController.updateDevelopmentTask);
router.delete("/:id",verifyToken,devController.deleteDevelopmentTask);
module.exports = router;
>>>>>>> 93a4e9b (changes don)

const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const reportsController = require("../controllers/reportsController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post(
  "/upload",
  verifyToken,
  isAdmin,
  upload.single("file"),
  reportsController.uploadDocument
);

router.get("/", verifyToken, reportsController.getAllDocuments);

router.delete("/:id", verifyToken, isAdmin, reportsController.deleteDocument);

module.exports = router;
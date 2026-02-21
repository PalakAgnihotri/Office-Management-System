const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, notesController.createNote);
router.get("/", verifyToken, notesController.getAllNotes);
router.delete("/:id", verifyToken, isAdmin, notesController.deleteNote);

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/employees", verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name FROM users WHERE role = 'employee'"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

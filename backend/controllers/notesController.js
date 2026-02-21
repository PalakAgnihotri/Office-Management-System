const db = require("../config/db");

const createNote = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ message: "All fields required" });
    }

    await db.execute(
      `INSERT INTO notes (title, category, content, created_by)
       VALUES (?, ?, ?, ?)`,
      [title, category, content, req.user.id]
    );

    res.status(201).json({ message: "Note saved successfully" });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notes ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("GET NOTES ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM notes WHERE id = ?",
      [req.params.id]
    );
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  deleteNote
};

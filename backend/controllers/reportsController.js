const db = require("../config/db");

const uploadDocument = async (req, res) => {
  try {
    const { client_name, document_type, employee_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    await db.execute(
      `INSERT INTO documents
       (client_name, document_type, file_path, employee_id, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [
        client_name,
        document_type,
        req.file.filename,
        employee_id || null,
        req.user.id,
      ]
    );

    res.status(201).json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM documents ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("GET DOC ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM documents WHERE id = ?",
      [req.params.id]
    );
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE DOC ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadDocument,
  getAllDocuments,
  deleteDocument
};
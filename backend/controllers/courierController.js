const db = require("../config/db");

const createInward = async (req, res) => {
  try {
    const { courier_no, from, received_by, remarks } = req.body;

    await db.execute(
      `INSERT INTO courier_inward 
       (courier_no, sender, received_by, remarks, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [courier_no, from, received_by, remarks, req.user.id]
    );

    res.status(201).json({ message: "Courier inward saved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllInward = async (req, res) => {
  try {
    console.log("GET inward called");

    const [rows] = await db.execute(
      "SELECT * FROM courier_inward ORDER BY created_at DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error("ERROR IN GET ALL INWARD:", error);
    res.status(500).json({ error: error.message });
  }
};


const deleteInward = async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM courier_inward WHERE id = ?",
      [req.params.id]
    );
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOutward = async (req, res) => {
  try {
    const { courier_no, to, sent_by, remarks } = req.body;

    await db.execute(
      `INSERT INTO courier_outward
       (courier_no, recipient, sent_by, remarks, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [courier_no, to, sent_by, remarks, req.user.id]
    );

    res.status(201).json({ message: "Courier outward saved" });
  } catch (error) {
    console.error("ERROR CREATE OUTWARD:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllOutward = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM courier_outward ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("ERROR GET OUTWARD:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteOutward = async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM courier_outward WHERE id = ?",
      [req.params.id]
    );
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("ERROR DELETE OUTWARD:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createInward,
  getAllInward,
  deleteInward,
  createOutward,
  getAllOutward,
  deleteOutward,
  
};

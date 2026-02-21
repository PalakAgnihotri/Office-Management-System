const db = require("../config/db");

// Create cheque
const createCheque = async (req, res) => {
  try {
    const { cheque_no, payee, amount, bank, cheque_date } = req.body;

    await db.execute(
      `INSERT INTO cheque_payments 
       (cheque_no, payee, amount, bank, cheque_date)
       VALUES (?, ?, ?, ?, ?)`,
      [cheque_no, payee, amount, bank, cheque_date]
    );

    res.status(201).json({ message: "Cheque saved successfully" });
  } catch (error) {
    console.log("ERROR CREATE CHEQUE:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all cheques
const getAllCheques = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM cheque_payments ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.log("ERROR GET CHEQUES:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete cheque
const deleteCheque = async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM cheque_payments WHERE id = ?",
      [req.params.id]
    );
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("ERROR DELETE CHEQUE:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCheque,
  getAllCheques,
  deleteCheque
};
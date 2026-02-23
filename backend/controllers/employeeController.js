const db = require("../config/db");
const bcrypt = require("bcryptjs");
// Create employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation, joining_date } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO employees 
       (name, email, password, phone, department, designation, joining_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword,phone, department, designation, joining_date ]
    );

    res.json({ message: "Employee created successfully" });

  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM employees ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.log("ERROR GET EMPLOYEES:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM employees WHERE id = ?",
      [req.params.id]
    );
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("ERROR DELETE EMPLOYEE:", error);
    res.status(500).json({ error: error.message });
  }
};
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, phone, department, designation, joining_date FROM employees WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.log("PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createEmployee,
  getAllEmployees,
  deleteEmployee,
  getProfile
};
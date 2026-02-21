const db = require("../config/db");

// Create employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, designation, joining_date } = req.body;

    await db.execute(
      `INSERT INTO employees 
       (name, email, phone, department, designation, joining_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, department, designation, joining_date || null ]
    );

    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.log("ERROR CREATE EMPLOYEE:", error);
    res.status(500).json({ error: error.message });
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

module.exports = {
  createEmployee,
  getAllEmployees,
  deleteEmployee
};
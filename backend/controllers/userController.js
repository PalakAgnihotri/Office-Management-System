const db = require("../config/db");

exports.getEmployees = async (req, res) => {
  try {
    const [employees] = await db.execute(
      "SELECT id, name FROM users WHERE role = 'employee'"
    );
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const [clients] = await db.execute(
      "SELECT id, name FROM users WHERE role = 'client'"
    );
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
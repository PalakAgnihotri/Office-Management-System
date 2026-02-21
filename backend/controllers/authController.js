const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    await db.execute(sql, [name, email, hashedPassword, role || "employee"]);

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllTasks = async (req, res) => {
  try {
    const [tasks] = await db.execute(`
      SELECT tasks.*, users.name AS employee_name
      FROM tasks
      LEFT JOIN users ON tasks.assigned_to = users.id
    `);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getMyTasks = async (req, res) => {
  try {
    const [tasks] = await db.execute(
      "SELECT * FROM tasks WHERE assigned_to = ?",
      [req.user.id]
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const taskId = req.params.id;

    await db.execute(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [status, taskId]
    );

    res.json({ message: "Task updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

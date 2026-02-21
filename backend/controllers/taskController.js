const db = require("../config/db");

const createTask = async (req, res) => {
  try {

    const {
      title,
      client,
      priority,
      status,
      due_date,
      assigned_to,
      allotted_hours
    } = req.body;

    const sql = `
      INSERT INTO tasks
      (title, client, priority, status, due_date, assigned_to, created_by,allotted_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;

    await db.execute(sql, [
      title || null,
      client || null,
      priority || "Medium",
      status || "Pending",
      due_date || null,
      assigned_to || null,
      allotted_hours || null,
      req.user.id
    ]);

    res.status(201).json({ message: "Task created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllTasks = async (req, res) => {
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

const getMyTasks = async (req, res) => {
  try {
    console.log("Logged Employee ID:", req.user.id);
    const [tasks] = await db.execute(
      "SELECT * FROM tasks WHERE assigned_to = ?",
      [req.user.id]
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {

    const taskId = req.params.id;

    const title = req.body.title || null;
    const client = req.body.client || null;
    const priority = req.body.priority || "Medium";
    const status = req.body.status || "Pending";
    const due_date = req.body.due_date || null;
    const allotted_hours =
      req.body.allotted_hours !== undefined
        ? req.body.allotted_hours
        : null;

    await db.execute(
      `UPDATE tasks 
       SET title=?, client=?, priority=?, status=?, due_date=?, allotted_hours=? 
       WHERE id=?`,
      [title, client, priority, status, due_date, allotted_hours, taskId]
    );

    res.json({ message: "Task updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status, assigned_to } = req.body;
    const taskId = req.params.id;

    await db.execute(
      "UPDATE tasks SET status = ?, assigned_to = ? WHERE id = ?",
      [status, assigned_to, taskId]
    );

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addTaskUpdate = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status, comment } = req.body;
    const userId = req.user.id;

    await db.execute(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [status, taskId]
    );

    await db.execute(
      "INSERT INTO task_updates (task_id, comment, status, updated_by) VALUES (?, ?, ?, ?)",
      [taskId, comment, status, userId]
    );

    res.json({ message: "Task updated with history successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPendingTasks = async (req, res) => {
  try {
    const [tasks] = await db.execute(
      `SELECT tasks.*, users.name AS employee_name
       FROM tasks
       LEFT JOIN users ON tasks.assigned_to = users.id
       WHERE tasks.assigned_to IS NULL`
    );

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    await db.execute(
      "DELETE FROM tasks WHERE id = ?",
      [taskId]
    );

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateTaskByEmployee = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status, allotted_hours } = req.body;

    await db.execute(
      `UPDATE tasks 
       SET status = ?, allotted_hours = ?
       WHERE id = ? AND assigned_to = ?`,
      [
        status || "Pending",
        allotted_hours !== undefined ? allotted_hours : null,
        taskId,
        req.user.id
      ]
    );

    res.json({ message: "Task updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  addTaskUpdate,
  getPendingTasks,
  deleteTask,
  updateTaskByEmployee
};

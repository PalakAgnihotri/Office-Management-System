const db = require("../config/db");

const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    await db.execute(
      "INSERT INTO tasks (title, created_by) VALUES (?, ?)",
      [title, req.user?.id || null]
    );

    res.status(201).json({ message: "Task created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {

    const [tasks] = await db.execute(`
  SELECT 
    t.id,
    t.title,
    t.priority,
    t.status,
    t.due_date,
    t.allotted_hours,
    u.name AS employee_name
  FROM tasks t
  LEFT JOIN users u ON t.assigned_to = u.id
  ORDER BY t.id DESC
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
    const { priority, status, due_date, allotted_hours, employee_id } = req.body;

    await db.execute(
      `UPDATE tasks 
       SET priority = ?, 
           status = ?, 
           due_date = ?, 
           allotted_hours = ?,
           assigned_to = ?
       WHERE id = ?`,
      [
        priority || "Medium",
        status || "Pending",
        due_date || null,
        allotted_hours !== undefined ? allotted_hours : null,
        employee_id !== undefined ? employee_id : null,
        taskId
      ]
    );

    res.json({ message: "Task updated successfully" });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
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
    console.log("Deleting task:", req.params.id);

    const taskId = req.params.id;

    await db.execute(
      "DELETE FROM tasks WHERE id = ?",
      [taskId]
    );

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    console.log("DELETE ERROR:", error);
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
const editTaskName = async (req, res) => {
  try {
    const { title } = req.body;
    const taskId = req.params.id;

    await db.execute(
      "UPDATE tasks SET title = ? WHERE id = ?",
      [title, taskId]
    );

    res.json({ message: "Task updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const assignTask = async (req, res) => {
  try {
    const { employeeId, allotted_hours } = req.body;
    const taskId = req.params.id;

    await db.execute(
      "UPDATE tasks SET assigned_to = ?, allotted_hours = ? WHERE id = ?",
      [
        employeeId || null,
        allotted_hours || null,
        taskId
      ]
    );

    res.json({ message: "Task assigned successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAssignedTasks = async (req, res) => {
  try {
    const [tasks] = await db.execute(
      "SELECT * FROM tasks WHERE assigned_to IS NOT NULL"
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getEntryTasks = async (req, res) => {
  try {
    const [tasks] = await db.execute(`
      SELECT t.id,
             t.title,
             t.priority,
             t.status,
             t.due_date,
             t.allotted_hours,
             t.assigned_to,
             u.name AS employee_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.assigned_to IS NOT NULL
    `);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  updateTaskByEmployee,
  editTaskName,
  assignTask,
  getAssignedTasks,
  getEntryTasks
};

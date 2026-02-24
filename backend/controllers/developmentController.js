const db = require("../config/db");

const createDevelopmentTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      due_date,
      allotted_hours,
      employee_id
    } = req.body;

    await db.execute(
      `INSERT INTO development_tasks
       (title, description, priority, status, due_date, allotted_hours, assigned_to, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        priority || "Medium",
        status || "Pending",
        due_date || null,
        allotted_hours || null,
        employee_id || null,
        req.user?.id || null
      ]
    );

    res.json({ message: "Development task created" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const deleteDevelopmentTask = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM development_tasks WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Development task deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getDevelopmentTasks = async (req, res) => {
  try {
    const [tasks] = await db.execute(`
      SELECT d.*, u.name AS employee_name
      FROM development_tasks d
      LEFT JOIN users u ON d.assigned_to = u.id
      ORDER BY d.id DESC
    `);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateDevelopmentTask = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      title,
      description,
      priority,
      status,
      due_date,
      allotted_hours,
      employee_id
    } = req.body;

    await db.execute(
      `UPDATE development_tasks
       SET title = ?,
           description = ?,
           priority = ?,
           status = ?,
           due_date = ?,
           allotted_hours = ?,
           assigned_to = ?
       WHERE id = ?`,
      [
        title ?? null,
        description ?? null,
        priority ?? null,
        status ?? null,
        due_date ?? null,
        allotted_hours ?? null,
        employee_id ?? null,
        id
      ]
    );

    res.json({ message: "Development task updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDevelopmentTask,
  getDevelopmentTasks,
  deleteDevelopmentTask,
  updateDevelopmentTask
};

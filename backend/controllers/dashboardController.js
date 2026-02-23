const db = require("../config/db");

// 🟢 ADMIN DASHBOARD
const getAdminDashboard = async (req, res) => {
  try {
    const [[total]] = await db.execute(
      "SELECT COUNT(*) AS count FROM tasks"
    );

    const [[completed]] = await db.execute(
      "SELECT COUNT(*) AS count FROM tasks WHERE status = 'Completed'"
    );

    const [[pending]] = await db.execute(
      "SELECT COUNT(*) AS count FROM tasks WHERE status = 'Pending'"
    );

    const [[overdue]] = await db.execute(
      "SELECT COUNT(*) AS count FROM tasks WHERE due_date < CURDATE() AND status != 'Completed'"
    );

    const [productivity] = await db.execute(`
      SELECT e.name, COUNT(t.id) AS completed_tasks
      FROM employees e
      LEFT JOIN tasks t 
        ON e.id = t.assigned_to 
        AND t.status = 'Completed'
      GROUP BY e.id
    `);

    res.json({
      totalTasks: total.count,
      completedTasks: completed.count,
      pendingTasks: pending.count,
      overdueTasks: overdue.count,
      employeeProductivity: productivity
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
// 🔵 EMPLOYEE DASHBOARD
const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [total] = await db.execute(
      "SELECT COUNT(*) AS total FROM tasks WHERE assigned_to = ?",
      [userId]
    );

    const [completed] = await db.execute(
      "SELECT COUNT(*) AS completed FROM tasks WHERE assigned_to = ? AND status = 'Completed'",
      [userId]
    );

    const [pending] = await db.execute(
      "SELECT COUNT(*) AS pending FROM tasks WHERE assigned_to = ? AND status = 'Pending'",
      [userId]
    );

    const [overdue] = await db.execute(
      "SELECT COUNT(*) AS overdue FROM tasks WHERE assigned_to = ? AND due_date < CURDATE() AND status != 'Completed'",
      [userId]
    );

    res.json({
      totalTasks: total[0].total,
      completedTasks: completed[0].completed,
      pendingTasks: pending[0].pending,
      overdueTasks: overdue[0].overdue
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAdminDashboard,
  getEmployeeDashboard
};

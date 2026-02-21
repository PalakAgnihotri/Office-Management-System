const db = require("../config/db");

// 🟢 ADMIN DASHBOARD
const getAdminDashboard = async (req, res) => {
  try {
    // Total Tasks
    const [total] = await db.execute("SELECT COUNT(*) AS total FROM tasks");

    // Completed Tasks
    const [completed] = await db.execute(
      "SELECT COUNT(*) AS completed FROM tasks WHERE status = 'Completed'"
    );

    // Pending Tasks
    const [pending] = await db.execute(
      "SELECT COUNT(*) AS pending FROM tasks WHERE status = 'Pending'"
    );

    // Overdue Tasks
    const [overdue] = await db.execute(
      "SELECT COUNT(*) AS overdue FROM tasks WHERE due_date < CURDATE() AND status != 'Completed'"
    );

    // Employee Productivity
    const [productivity] = await db.execute(`
      SELECT users.name, COUNT(tasks.id) AS completed_tasks
      FROM users
      LEFT JOIN tasks ON users.id = tasks.assigned_to 
      AND tasks.status = 'Completed'
      WHERE users.role = 'employee'
      GROUP BY users.id
    `);

    res.json({
      totalTasks: total[0].total,
      completedTasks: completed[0].completed,
      pendingTasks: pending[0].pending,
      overdueTasks: overdue[0].overdue,
      employeeProductivity: productivity
    });

  } catch (error) {
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

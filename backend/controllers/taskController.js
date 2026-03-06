const { sendEmail } = require("../utils/email");
const db = require("../config/db");

const createTask = async (req, res) => {
  console.log("BODY:", req.body);

  try {
    const {
      title,
      description,
      priority,
      status,
      due_date,
      allotted_hours,
      employee_id,
      remarks
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    /* INSERT TASK */
    const [result] = await db.execute(
      `INSERT INTO tasks 
       (title, description, priority, status, due_date, allotted_hours, assigned_to, created_by, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        priority || "Medium",
        status || "Pending",
        due_date || null,
        allotted_hours || null,
        employee_id || null,
        req.user?.id || null,
        remarks || null,
      ]
    );

    /* SEND EMAIL IF EMPLOYEE ASSIGNED */
    if (employee_id) {

      const [emp] = await db.execute(
        "SELECT name, email FROM employees WHERE id = ?",
        [employee_id]
      );

      if (emp.length) {

        await sendEmail(
          emp[0].email,
          "New Task Assigned",
          `
Hello ${emp[0].name},

A new task has been assigned to you.

Task: ${title}
Priority: ${priority || "Medium"}
Due Date: ${due_date || "-"}

Please login to Taskify to view the task.

Regards
Taskify System
          `
        );

        console.log("EMAIL SENT TO:", emp[0].email);

      }

    }

    res.status(201).json({ message: "Task created successfully" });

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
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
    t.remarks,
    t.work_date,
    t.allotted_hours,
    e.name AS employee_name
  FROM tasks t
  LEFT JOIN employees e ON t.assigned_to = e.id
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
console.log("JWT USER:", req.user);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {

    const taskId = req.params.id;

    const {
      title,
      description,
      priority,
      status,
      due_date,
      allotted_hours,
      employee_id,
      remarks,
      work_date
    } = req.body;

    /* 1️⃣ Get existing task */
    const [oldTask] = await db.execute(
      "SELECT title, assigned_to FROM tasks WHERE id = ?",
      [taskId]
    );

    if (!oldTask.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const previousEmployee = oldTask[0].assigned_to;
    const newEmployee = employee_id ? Number(employee_id) : null;

    /* 2️⃣ Update task */
    await db.execute(
      `UPDATE tasks 
       SET title=?,
           description=?,
           priority=?,
           status=?,
           due_date=?,
           allotted_hours=?,
           assigned_to=?,
           remarks=?,
           work_date=?
       WHERE id=?`,
      [
        title,
        description || null,
        priority || "Medium",
        status || "Pending",
        due_date || null,
        allotted_hours ?? null,
        newEmployee,
        remarks || null,
        work_date || null,
        taskId
      ]
    );

    /* 3️⃣ If employee assignment changed */
    if (newEmployee && Number(previousEmployee) !== Number(newEmployee)) {

      /* Send email to NEW employee */
      const [emp] = await db.execute(
        "SELECT name, email FROM employees WHERE id = ?",
        [newEmployee]
      );

      if (emp.length) {

        try {

          await sendEmail(
            emp[0].email,
            "Task Assigned",
            `Hello ${emp[0].name},

You have been assigned a task.

Task: ${title}
Priority: ${priority}
Due Date: ${due_date || "-"}

Please login to Taskify.

Regards
Taskify System`
          );

          console.log("EMAIL SENT TO:", emp[0].email);

        } catch (err) {

          console.log("Email failed:", err.message);

        }

      }

      /* Notify old employee if reassigned */
      if (previousEmployee) {

        const [oldEmp] = await db.execute(
          "SELECT name, email FROM employees WHERE id = ?",
          [previousEmployee]
        );

        if (oldEmp.length) {

          try {

            await sendEmail(
              oldEmp[0].email,
              "Task Reassigned",
              `Hello ${oldEmp[0].name},

Task "${title}" has been reassigned to another employee.

Regards
Taskify System`
            );

          } catch (err) {

            console.log("Email failed:", err.message);

          }

        }

      }

    }

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
    const [tasks] = await db.execute(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        t.allotted_hours,
        t.remarks,
        t.assigned_to
      FROM tasks t
      WHERE t.assigned_to IS NULL
      ORDER BY t.id DESC
    `);
    

    res.json(tasks);

  } catch (error) {
    console.error("PENDING TASK ERROR:", error);
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

    const {
      status,
      allotted_hours,
      remarks,
      work_date
    } = req.body;

    console.log("UPDATE REQUEST:", {
      taskId,
      status,
      allotted_hours,
      remarks,
      work_date,
      user: req.user.id
    });

    const [result] = await db.execute(
      `UPDATE tasks 
       SET status = ?, allotted_hours = ?, remarks = ?, work_date = ?
       WHERE id = ?`,
      [
        status || "Pending",
        allotted_hours ?? null,
        remarks ?? null,
        work_date ?? null,
        taskId
      ]
    );

    console.log("ROWS UPDATED:", result.affectedRows);

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

    /* 1️⃣ Get existing task info */
    const [taskRows] = await db.execute(
      "SELECT title, assigned_to FROM tasks WHERE id = ?",
      [taskId]
    );

    if (!taskRows.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskRows[0];
    const oldEmployeeId = task.assigned_to;

    /* 2️⃣ Update assignment */
    await db.execute(
      "UPDATE tasks SET assigned_to = ?, allotted_hours = ? WHERE id = ?",
      [employeeId || null, allotted_hours || null, taskId]
    );

    /* 3️⃣ Send email to NEW employee */
    if (employeeId) {

      const [emp] = await db.execute(
        "SELECT name, email FROM employees WHERE id = ?",
        [employeeId]
      );

      if (emp.length) {

        await sendEmail(
          emp[0].email,
          "New Task Assigned",
          `
Hello ${emp[0].name},

You have been assigned a new task.

Task: ${task.title}
Allotted Time: ${allotted_hours || "-"} minutes

Please login to Taskify to view details.

Regards
Taskify System
          `
        );

      }

    }

    /* 4️⃣ Send email to OLD employee if reassigned */
    if (oldEmployeeId && oldEmployeeId !== employeeId) {

      const [oldEmp] = await db.execute(
        "SELECT name, email FROM employees WHERE id = ?",
        [oldEmployeeId]
      );

      if (oldEmp.length) {

        await sendEmail(
          oldEmp[0].email,
          "Task Reassigned",
          `
Hello ${oldEmp[0].name},

The following task has been reassigned to another employee:

Task: ${task.title}

This task is no longer assigned to you.

Regards
Taskify System
          `
        );

      }

    }

    res.json({ message: "Task assigned successfully" });

  } catch (error) {

    console.error(error);

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
             t.description,
             t.priority,
             t.status,
             t.due_date,
             t.allotted_hours,
             t.assigned_to,
             t.remarks,
             t.work_date,
             e.name AS employee_name
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      ORDER BY t.id DESC
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

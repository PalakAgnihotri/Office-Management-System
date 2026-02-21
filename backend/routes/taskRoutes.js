const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const db = require("../config/db"); // ✅ you forgot this

// Admin routes
router.post("/create", verifyToken, isAdmin, taskController.createTask);
router.get("/all", verifyToken, isAdmin, taskController.getAllTasks);
router.get("/pending", verifyToken, isAdmin, taskController.getPendingTasks);
router.put("/:id", verifyToken, isAdmin, taskController.updateTask);
// Employee routes
router.get("/my", verifyToken, taskController.getMyTasks);
router.get("/my-tasks", verifyToken, taskController.getMyTasks);
router.put("/employee/:id", verifyToken, taskController.updateTaskByEmployee);
router.put("/update/:id", verifyToken, taskController.updateTaskStatus);
router.put("/:id", verifyToken, taskController.updateTask);

router.post("/update-with-comment/:id", verifyToken, taskController.addTaskUpdate);

// Task updates history
router.get("/updates/:taskId", verifyToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const [rows] = await db.execute(
      `SELECT tu.*, t.title AS task_title 
       FROM task_updates tu
       JOIN tasks t ON tu.task_id = t.id
       WHERE tu.task_id = ?
       ORDER BY tu.created_at DESC`,
      [taskId]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id",verifyToken,taskController.deleteTask)

module.exports = router;
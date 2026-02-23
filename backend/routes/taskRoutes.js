const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const db = require("../config/db"); // ✅ you forgot this


router.post("/create", verifyToken, isAdmin, taskController.createTask);
router.get("/all", verifyToken, isAdmin, taskController.getAllTasks);
router.get("/pending", verifyToken, isAdmin, taskController.getPendingTasks);
router.put("/:id", verifyToken, isAdmin, taskController.updateTask);
router.put("/edit/:id", verifyToken, isAdmin, taskController.editTaskName);
router.put("/assign/:id", verifyToken, isAdmin, taskController.assignTask);
router.get("/assigned", verifyToken, isAdmin, taskController.getAssignedTasks);

router.get("/my", verifyToken, taskController.getMyTasks);
router.get("/my-tasks", verifyToken, taskController.getMyTasks);
router.put("/employee/:id", verifyToken, taskController.updateTaskByEmployee);
router.put("/update/:id", verifyToken, taskController.updateTaskStatus);
router.delete("/:id", verifyToken, isAdmin, taskController.deleteTask);
router.post("/update-with-comment/:id", verifyToken, taskController.addTaskUpdate);
router.get("/entry",verifyToken, taskController.getEntryTasks);

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

module.exports = router;
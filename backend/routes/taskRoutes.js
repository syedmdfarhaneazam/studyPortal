const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Protected routes (require authentication)
router.post("/", protect, createTask); // Create a task
router.get("/", protect, getTasks); // Get tasks for the logged-in user
router.put("/:id", protect, updateTask); // Update a task (e.g., mark completed)
router.delete("/:id", protect, deleteTask); // Delete a task

module.exports = router;

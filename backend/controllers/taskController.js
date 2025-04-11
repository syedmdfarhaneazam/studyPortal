const Task = require("../models/Task");
const User = require("../models/User");
// task creation only for teacher
const createTask = async (req, res) => {
  const { description, date, assignedTo } = req.body;

  try {
    if (!req.user || req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can create tasks" });
    }

    if (!description || !date) {
      return res
        .status(400)
        .json({ message: "Description and date are required" });
    }

    console.log("Received task data:", { description, date, assignedTo });

    const task = new Task({
      description,
      date: new Date(date),
      createdBy: req.user.id,
      assignedTo: assignedTo || [],
    });

    const savedTask = await task.save();
    console.log("Task saved:", savedTask);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Create task error:", {
      message: error.message,
      stack: error.stack,
      data: req.body,
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// display all task funcitoin
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("createdBy", "name")
      .populate("assignedTo", "name email"); // to which studnet it is assigned to
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// to update task
// not working
const updateTask = async (req, res) => {
  const { description, date, assignedTo, reminderDate, completed } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      task.createdBy.toString() !== req.user.id &&
      !task.assignedTo.includes(req.user.id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.description = description || task.description;
    task.date = date || task.date;
    task.assignedTo = assignedTo || task.assignedTo;
    task.reminderDate = reminderDate || task.reminderDate;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      task.createdBy.toString() !== req.user.id ||
      req.user.role !== "teacher"
    ) {
      return res.status(403).json({
        message: "Only the teacher who created this task can delete it",
      });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// export all
module.exports = { createTask, getTasks, updateTask, deleteTask };

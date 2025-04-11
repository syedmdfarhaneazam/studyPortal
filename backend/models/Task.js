const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Task description is required"],
  },
  date: { type: Date, required: [true, "Task date is required"] },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reminderDate: { type: Date, default: null },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;

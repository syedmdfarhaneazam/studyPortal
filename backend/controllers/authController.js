const User = require("../models/User"); // Single declaration at the top
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// rester a neeew user
const signupUser = async (req, res) => {
  const { name, email, password, role, section } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role === "student" && !section) {
      return res
        .status(400)
        .json({ message: "Section is required for students" });
    }

    user = new User({
      name,
      email,
      password,
      role: role || "student",
      ...(role === "student" && { section }),
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      },
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      section: user.section,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// give token to exiting user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      },
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// get my info
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// update me
const updateProfile = async (req, res) => {
  const { about, department, section, skills } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.about = about || user.about;
    user.department = department || user.department;

    if (user.role === "student") {
      user.section = section || user.section;
      user.skills = skills || user.skills;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      about: user.about,
      department: user.department,
      section: user.section,
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// add reminder only for student
const addReminder = async (req, res) => {
  const { date, description } = req.body;

  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can add reminders" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.reminders.push({ date, description });
    await user.save();

    res.status(201).json(user.reminders[user.reminders.length - 1]);
  } catch (error) {
    console.error("Add reminder error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete funciton
const deleteReminder = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can delete reminders" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reminderIndex = user.reminders.findIndex(
      (reminder) => reminder._id.toString() === req.params.id,
    );
    if (reminderIndex === -1) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    user.reminders.splice(reminderIndex, 1);
    await user.save();

    res.json({ message: "Reminder deleted" });
  } catch (error) {
    console.error("Delete reminder error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// student list generator
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "name email about department section skills",
    );
    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// teacher list generator
const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select(
      "name email about department",
    );
    res.json(teachers);
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// export all here
module.exports = {
  signupUser,
  loginUser,
  getMe,
  updateProfile,
  addReminder,
  deleteReminder,
  getStudents,
  getTeachers,
};

// end the code

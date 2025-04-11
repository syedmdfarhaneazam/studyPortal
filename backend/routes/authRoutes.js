const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  signupUser,
  loginUser,
  getMe,
  updateProfile,
  addReminder,
  deleteReminder,
  getStudents,
  getTeachers,
} = require("../controllers/authController");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/reminder", protect, addReminder);
router.delete("/reminder/:id", protect, deleteReminder);
router.get("/students", protect, getStudents); // New route
router.get("/teachers", protect, getTeachers); // New route

module.exports = router;

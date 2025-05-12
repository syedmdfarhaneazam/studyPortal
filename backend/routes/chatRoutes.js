const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getRoomMessages,
  saveMessage,
  getUserRooms,
} = require("../controllers/chatController");

router.get("/rooms", protect, getUserRooms);
router.get("/rooms/:roomId", protect, getRoomMessages);
router.post("/messages", protect, saveMessage);

module.exports = router;

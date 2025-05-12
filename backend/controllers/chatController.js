const Message = require("../models/Message");
const User = require("../models/User");
const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .populate("sender", "name email")
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get room messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const saveMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;

    if (!roomId || !content) {
      return res
        .status(400)
        .json({ message: "Room ID and content are required" });
    }

    const message = new Message({
      roomId,
      sender: req.user.id,
      content,
    });

    const savedMessage = await message.save();
    const populatedMessage = await Message.findById(savedMessage._id).populate(
      "sender",
      "name email",
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Save message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      roomId: { $regex: userId },
    }).distinct("roomId");
    const roomsWithUsers = await Promise.all(
      messages.map(async (roomId) => {
        const otherUserId = roomId.replace(userId, "").replace("_", "");
        const otherUser =
          await User.findById(otherUserId).select("name email role");

        return {
          roomId,
          otherUser,
        };
      }),
    );

    res.json(roomsWithUsers);
  } catch (error) {
    console.error("Get user rooms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRoomMessages,
  saveMessage,
  getUserRooms,
};

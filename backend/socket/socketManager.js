const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function setupSocketIO(server) {
  const io = socketIO(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://study-portal-owioe519m-syed-md-farhan-e-azams-projects.vercel.app",
        "https://study-portal-tan.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: Token not provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication error"));
    }
  });

  // Connected users map: userId -> socketId
  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // Store user connection
    connectedUsers.set(userId, socket.id);
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

    // Emit online status to all users
    io.emit("userStatus", {
      userId,
      status: "online",
    });

    // Join user to their rooms
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    // Handle new messages
    socket.on("sendMessage", async (data) => {
      const { roomId, content } = data;

      // Create message object
      const message = {
        roomId,
        sender: {
          _id: socket.user.id,
          name: socket.user.name,
          email: socket.user.email,
        },
        content,
        timestamp: new Date(),
      };

      // Broadcast to room
      io.to(roomId).emit("newMessage", message);

      // Send notification to the other user in the room
      const otherUserId = roomId.replace(socket.user.id, "").replace("_", "");

      const otherUserSocketId = connectedUsers.get(otherUserId);

      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit("chatNotification", {
          roomId,
          sender: socket.user.name,
          message: content,
        });
      }
    });

    // Handle typing status
    socket.on("typing", (data) => {
      const { roomId, isTyping } = data;

      socket.to(roomId).emit("userTyping", {
        userId: socket.user.id,
        name: socket.user.name,
        isTyping,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);

      io.emit("userStatus", {
        userId,
        status: "offline",
      });
    });
  });

  return io;
}

module.exports = setupSocketIO;

import { io } from "socket.io-client";
import { addMessage, addNotification } from "../redux/chatSlice";

let socket = null;
let store = null;

export const initializeSocket = (token, storeInstance) => {
  store = storeInstance;

  if (socket) {
    socket.disconnect();
  }

  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("newMessage", (message) => {
    const { roomId } = message;

    // Add message to redux store
    store.dispatch(addMessage({ roomId, message }));

    // Add notification
    store.dispatch(addNotification({ roomId }));
  });

  socket.on("chatNotification", (notification) => {
    const { roomId } = notification;

    // Add notification
    store.dispatch(addNotification({ roomId }));

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`New message from ${notification.sender}`, {
        body: notification.message,
      });
    }
  });

  socket.on("userTyping", (data) => {
    // Handle typing indicator
    console.log(`${data.name} is ${data.isTyping ? "typing" : "not typing"}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const joinRoom = (roomId) => {
  if (socket) {
    socket.emit("joinRoom", roomId);
  }
};

export const sendMessage = (roomId, content) => {
  if (socket) {
    socket.emit("sendMessage", { roomId, content });
  }
};

export const setTypingStatus = (roomId, isTyping) => {
  if (socket) {
    socket.emit("typing", { roomId, isTyping });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

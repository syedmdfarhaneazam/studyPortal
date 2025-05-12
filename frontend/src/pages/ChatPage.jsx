import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchRoomMessages,
  setActiveRoom,
  addMessage,
  loadLocalMessages,
  clearNotifications,
} from "../redux/chatSlice";
import {
  joinRoom,
  sendMessage,
  setTypingStatus,
} from "../services/socketService";

function ChatPage() {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);

  const [newMessage, setNewMessage] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const roomMessages = messages[roomId] || [];

  // Extract the other user's ID from the room ID
  const otherUserId = roomId.replace(user._id, "").replace("_", "");

  useEffect(() => {
    if (roomId) {
      // Set active room
      dispatch(setActiveRoom(roomId));

      // Clear notifications
      dispatch(clearNotifications(roomId));

      // Join socket room
      joinRoom(roomId);

      // Load messages from localStorage first
      dispatch(loadLocalMessages(roomId));

      // Then fetch from server
      dispatch(fetchRoomMessages(roomId));
    }
  }, [roomId, dispatch]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [roomMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Handle typing indicator
    if (!isUserTyping) {
      setIsUserTyping(true);
      setTypingStatus(roomId, true);
    }

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setIsUserTyping(false);
      setTypingStatus(roomId, false);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    // Create message object
    const message = {
      roomId,
      sender: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Add to local state
    dispatch(addMessage({ roomId, message }));

    // Send via socket
    sendMessage(roomId, newMessage);

    // Clear input
    setNewMessage("");

    // Reset typing status
    setIsUserTyping(false);
    setTypingStatus(roomId, false);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={handleBack} className="back-button">
          &larr; Back
        </button>
        <h2>Chat</h2>
      </div>

      <div className="messages-container">
        {roomMessages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          roomMessages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`message ${msg.sender._id === user._id ? "sent" : "received"}`}
            >
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;

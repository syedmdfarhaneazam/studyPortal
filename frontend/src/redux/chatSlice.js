import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchUserRooms = createAsyncThunk(
  "chat/fetchUserRooms",
  async (_, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/chat/rooms`,
      config,
    );
    return response.data;
  },
);
export const fetchRoomMessages = createAsyncThunk(
  "chat/fetchRoomMessages",
  async (roomId, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/chat/rooms/${roomId}`,
      config,
    );
    return { roomId, messages: response.data };
  },
);
export const saveMessage = createAsyncThunk(
  "chat/saveMessage",
  async ({ roomId, content }, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/chat/messages`,
      { roomId, content },
      config,
    );
    return response.data;
  },
);
const getLocalStorageMessages = (roomId) => {
  try {
    const messages = localStorage.getItem(`chat_${roomId}`);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error("Error getting messages from localStorage:", error);
    return [];
  }
};
const saveLocalStorageMessages = (roomId, messages) => {
  try {
    localStorage.setItem(`chat_${roomId}`, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to localStorage:", error);
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    rooms: [],
    activeRoom: null,
    messages: {},
    notifications: {},
    loading: false,
    error: null,
  },
  reducers: {
    setActiveRoom(state, action) {
      state.activeRoom = action.payload;
      if (state.notifications[action.payload]) {
        state.notifications[action.payload] = 0;
      }
    },
    addMessage(state, action) {
      const { roomId, message } = action.payload;

      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }

      state.messages[roomId].push(message);
      saveLocalStorageMessages(roomId, state.messages[roomId]);
    },
    loadLocalMessages(state, action) {
      const roomId = action.payload;
      const localMessages = getLocalStorageMessages(roomId);

      if (localMessages.length > 0) {
        state.messages[roomId] = localMessages;
      }
    },
    addNotification(state, action) {
      const { roomId } = action.payload;

      if (state.activeRoom !== roomId) {
        if (!state.notifications[roomId]) {
          state.notifications[roomId] = 0;
        }
        state.notifications[roomId]++;
      }
    },
    clearNotifications(state, action) {
      const roomId = action.payload;
      state.notifications[roomId] = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchUserRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRoomMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { roomId, messages } = action.payload;
        const existingMessages = state.messages[roomId] || [];
        const mergedMessages = [...existingMessages, ...messages];
        const uniqueMessages = Array.from(
          new Map(mergedMessages.map((msg) => [msg._id, msg])).values(),
        );
        state.messages[roomId] = uniqueMessages;
        saveLocalStorageMessages(roomId, uniqueMessages);
      })
      .addCase(fetchRoomMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveMessage.fulfilled, (state, action) => {
        // The message is already added via socket, so we don't need to add it again
      });
  },
});

export const {
  setActiveRoom,
  addMessage,
  loadLocalMessages,
  addNotification,
  clearNotifications,
} = chatSlice.actions;

export default chatSlice.reducer;

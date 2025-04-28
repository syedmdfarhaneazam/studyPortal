import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { getState }) => {
    const { token } = getState().auth;
    if (!token) throw new Error("No token found");
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },
);

export const deleteReminder = createAsyncThunk(
  "auth/deleteReminder",
  async (reminderId, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/auth/reminder/${reminderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return { reminderId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete reminder",
      );
    }
  },
);

export const refreshReminders = createAsyncThunk(
  "auth/refreshReminders",
  async (_, { dispatch }) => {
    return await dispatch(fetchUser()).unwrap();
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    role: null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    signupStart(state) {
      state.loading = true;
      state.error = null;
    },
    signupSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    },
    signupFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      })
      .addCase(deleteReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && state.user.reminders) {
          state.user.reminders = state.user.reminders.filter(
            (reminder) => reminder._id !== action.payload.reminderId,
          );
        }
      })
      .addCase(deleteReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(refreshReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

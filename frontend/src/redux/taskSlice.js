import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// thunk to fetch tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/tasks`,
      config,
    );
    return response.data;
  },
);

// thunk to delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
      config,
    );
    return taskId; // return the id to remove it from state
  },
);

// thunk to refresh tasks
export const refreshTasks = createAsyncThunk(
  "tasks/refreshTasks",
  async (_, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/tasks`,
      config,
    );
    return response.data;
  },
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(refreshTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(refreshTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;

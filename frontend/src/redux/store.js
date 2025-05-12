import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import taskReducer from "./taskSlice";
import chatReducer from "./chatSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    chat: chatReducer,
  },
});

export default store;

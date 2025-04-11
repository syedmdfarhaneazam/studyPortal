import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "./redux/store";
import router from "./App";
import "./App.css";
import { fetchUser } from "./redux/authSlice";

// user data if token exists
if (localStorage.getItem("token")) {
  store.dispatch(fetchUser());
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);

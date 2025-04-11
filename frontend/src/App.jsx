import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import CalendarPage from "./pages/CalendarPage";
import TeacherList from "./pages/TeacherList";
import StudentList from "./pages/StudentList";
import { useSelector } from "react-redux";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "/reminders",
        element: (
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/calendar",
        element: (
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/teacher-list",
        element: (
          <ProtectedRoute>
            <TeacherList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student-list",
        element: (
          <ProtectedRoute>
            <StudentList />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;

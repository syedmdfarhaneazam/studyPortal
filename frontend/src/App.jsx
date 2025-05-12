import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Reminders from "./pages/Reminders.jsx";
import Profile from "./pages/Profile.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import TeacherList from "./pages/TeacherList.jsx";
import StudentList from "./pages/StudentList.jsx";
import ChatPage from "./pages/ChatPage.jsx"; // ✅ NEW IMPORT
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
      {
        path: "/chat/:roomId",
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;

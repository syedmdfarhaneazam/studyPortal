import { useSelector, useDispatch } from "react-redux";
import { NavNavLink, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const totalNotifications = Object.values(notifications || {}).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavNavLink to="/">Smart Reminder</NavNavLink>
      </div>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/tasks">Tasks</NavLink>
            </li>
            {user?.role === "student" && (
              <li>
                <NavLink to="/reminders">Reminders</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/students">Student List</NavLink>
            </li>
            <li>
              <NavLink to="/teachers">Teacher List</NavLink>
            </li>
            <li>
              <NavLink to="/calendar">Calendar</NavLink>
            </li>
            {totalNotifications > 0 && (
              <li>
                <div className="notification-badge">{totalNotifications}</div>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Signup</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

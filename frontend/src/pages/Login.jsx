import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "../redux/authSlice";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        `${process.env.API}/api/auth/login`,
        formData,
      );
      dispatch(
        loginSuccess({
          user: {
            _id: res.data._id,
            name: res.data.name,
            email: res.data.email,
          },
          token: res.data.token,
          role: res.data.role,
        }),
      );
      navigate("/dashboard");
    } catch (err) {
      dispatch(loginFailure(err.response?.data.message || "Login failed"));
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {role && <p>Welcome back, {role}!</p>}
      <p>
        Don’t have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}

export default Login;

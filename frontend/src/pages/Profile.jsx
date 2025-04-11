import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/authSlice";

function Profile() {
  const { user, role, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    department: "",
    section: "",
    skills: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        about: user.about || "",
        department: user.department || "",
        section: user.section || "",
        skills: user.skills?.join(", ") || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
      const updatedData = {
        about: formData.about,
        department: formData.department,
        ...(role === "student" && {
          section: formData.section,
          skills: skillsArray,
        }),
      };

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      dispatch(loginSuccess({ user: res.data, token, role: res.data.role }));
      setMessage("Profile updated successfully!");
      setIsEditing(false); // exit edit mode after saving
    } catch (error) {
      setMessage("Error updating profile.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(""); // clear alerting previous messages
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      about: user?.about || "",
      department: user?.department || "",
      section: user?.section || "",
      skills: user?.skills?.join(", ") || "",
    });
    setMessage("");
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {!isEditing ? (
        <div className="profile-view">
          <p>
            <strong>Name:</strong> {user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {role || "N/A"}
          </p>
          <p>
            <strong>About:</strong> {user?.about || "Not provided"}
          </p>
          <p>
            <strong>Department:</strong> {user?.department || "Not provided"}
          </p>
          {role === "student" && (
            <>
              <p>
                <strong>Section:</strong> {user?.section || "Not provided"}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {user?.skills?.join(", ") || "None listed"}
              </p>
            </>
          )}
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>About:</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div>
            <label>Department:</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          {role === "student" && (
            <>
              <div>
                <label>Section:</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Skills (comma-separated):</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <div className="form-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;

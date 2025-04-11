import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function TeacherList() {
  const { token } = useSelector((state) => state.auth);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${process.env.API}/api/auth/teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [token]);

  if (loading) {
    return (
      <div className="list-container">
        <p>Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h2>Teacher List</h2>
      {teachers.length > 0 ? (
        <ol className="user-list">
          {teachers.map((teacher) => (
            <li key={teacher._id} className="user-card">
              <h4>{teacher.name}</h4>
              <p>
                <strong>Email:</strong> {teacher.email}
              </p>
              <p>
                <strong>About:</strong> {teacher.about || "Not provided"}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {teacher.department || "Not provided"}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p>No teachers found.</p>
      )}
    </div>
  );
}

export default TeacherList;

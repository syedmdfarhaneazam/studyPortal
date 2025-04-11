import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function StudentList() {
  const { token } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [token]);

  if (loading) {
    return (
      <div className="list-container">
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <h2>Student List</h2>
      {students.length > 0 ? (
        <ol className="user-list">
          {students.map((student) => (
            <li key={student._id} className="user-card">
              <h4>{student.name}</h4>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
              <p>
                <strong>About:</strong> {student.about || "Not provided"}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {student.department || "Not provided"}
              </p>
              <p>
                <strong>Section:</strong> {student.section || "Not provided"}
              </p>
              <p>
                <strong>Skills:</strong>{" "}
                {student.skills?.join(", ") || "None listed"}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
}

export default StudentList;

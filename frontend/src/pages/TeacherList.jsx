"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TeacherList() {
  const { token, user } = useSelector((state) => state.auth);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/teachers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTeachers(res.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [token]);

  const handleTeacherClick = (teacherId) => {
    const ids = [user._id, teacherId].sort();
    const roomId = `${ids[0]}_${ids[1]}`;
    navigate(`/chat/${roomId}`);
  };

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
            <li
              key={teacher._id}
              className="user-card"
              onClick={() => handleTeacherClick(teacher._id)}
              style={{ cursor: "pointer" }}
            >
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

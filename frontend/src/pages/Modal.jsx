import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { fetchTasks } from "../redux/taskSlice";
import "./Modal.css";

function Modal({ role, date, onClose }) {
  const [text, setText] = useState("");
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!text) {
      alert("Please enter a description.");
      return;
    }

    try {
      if (role === "teacher") {
        const taskData = {
          description: text,
          date: moment(date).toISOString(), // for mongoDB
          assignedTo: [], // empty array according schema
        };
        console.log("Sending task data:", taskData); // debig line
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/tasks`,
          taskData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("Task added successfully:", response.data);
        dispatch(fetchTasks());
      } else if (role === "student") {
        const reminderData = {
          date: moment(date).toISOString(),
          description: text,
        };
        console.log("Sending reminder data:", reminderData); // debug line
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/reminder`,
          reminderData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("Reminder added successfully:", response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error adding task/reminder:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("Failed to add. Check console for details.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{role === "teacher" ? "Task to Add" : "Reminder to Add"}</h3>
        <p>Date: {moment(date).format("MMMM DD, YYYY")}</p>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter description"
          rows="4"
          cols="50"
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Add</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

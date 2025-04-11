import { useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { fetchTasks } from "../redux/taskSlice";
import "./Card.css";

function Card({ type, item, token, onDelete }) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      if (type === "task") {
        await axios.delete(`http://localhost:5000/api/tasks/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchTasks());
      } else if (type === "reminder") {
        await axios.delete(
          `http://localhost:5000/api/auth/reminder/${item._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        onDelete(item._id);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Failed to delete ${type}.`);
    }
  };

  return (
    <div className="card">
      <h4>{type === "task" ? item.description : item.description}</h4>
      <p>
        <strong>Date:</strong>{" "}
        {moment(type === "task" ? item.date : item.date).format("DD MMM YYYY")}
      </p>
      {type === "task" && (
        <p>
          <strong>Status:</strong> {item.completed ? "Completed" : "Pending"}
        </p>
      )}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default Card;

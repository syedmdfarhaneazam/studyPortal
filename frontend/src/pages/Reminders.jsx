import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import Card from "../components/Card";

function Reminders({ month }) {
  const { user, role, token } = useSelector((state) => state.auth);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      if (role === "student" && token) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setReminders(
            res.data.reminders.filter((reminder) =>
              moment(reminder.date).isSame(month, "month"),
            ),
          );
        } catch (error) {
          console.error("Error fetching reminders:", error);
        }
      }
    };
    fetchReminders();
  }, [month, role, token]);

  const handleDeleteReminder = (reminderId) => {
    setReminders(reminders.filter((reminder) => reminder._id !== reminderId));
  };

  if (role !== "student") return null;

  return (
    <div className="reminders">
      <h3>Reminders for {moment(month).format("MMMM YYYY")}</h3>
      {reminders.length > 0 ? (
        <div>
          {reminders.map((reminder) => (
            <Card
              key={reminder._id}
              type="reminder"
              item={reminder}
              token={token}
              onDelete={handleDeleteReminder}
            />
          ))}
        </div>
      ) : (
        <p>No reminders for this month.</p>
      )}
    </div>
  );
}

export default Reminders;

import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { deleteReminder, refreshReminders } from "../redux/authSlice";

function Reminders({ month }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Filter reminders by month
  const filteredReminders =
    user?.reminders?.filter((reminder) =>
      moment(reminder.date).isSame(month, "month"),
    ) || [];

  // Handle delete reminder
  const handleDelete = (reminderId) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      dispatch(deleteReminder(reminderId))
        .unwrap()
        .then(() => console.log("Reminder deleted:", reminderId))
        .catch((error) => console.error("Delete error:", error));
    }
  };

  return (
    <div className="reminders">
      <h3>
        Reminders{" "}
        <button onClick={() => dispatch(refreshReminders())}>Refresh</button>
      </h3>
      {filteredReminders.length > 0 ? (
        <ul>
          {filteredReminders.map((reminder) => (
            <li key={reminder._id} className="card">
              <h4>
                Reminder for {moment(reminder.date).format("MMMM DD, YYYY")}
              </h4>
              <p>{reminder.description}</p>
              <button onClick={() => handleDelete(reminder._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reminders for this month.</p>
      )}
    </div>
  );
}

export default Reminders;

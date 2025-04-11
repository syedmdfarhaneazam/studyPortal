import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchTasks } from "../redux/taskSlice";
import Tasks from "./Tasks";
import Reminders from "./Reminders";
import Modal from "./Modal";
import "./Calendar.css";

function CalendarPage() {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { role } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState(
    moment().startOf("month").toDate(),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  // generate coutem dates
  const daysInMonth = moment(currentDate).daysInMonth();
  const firstDayOfMonth = moment(currentDate).startOf("month").day(); // 0 (sun) - 6 (sat)
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null); // empty slots before month starts
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  // clicked date according to role
  const handleDateClick = (day) => {
    if (day) {
      const date = moment(currentDate).date(day).toDate();
      console.log("Date clicked:", date);
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const prevMonth = () =>
    setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
  const nextMonth = () =>
    setCurrentDate(moment(currentDate).add(1, "month").toDate());

  return (
    <div className="calendar-page">
      <div className="reminders-section">
        <Reminders month={currentDate} />
      </div>
      <div className="calendar-section">
        <h2>{role === "teacher" ? "Teacher Calendar" : "Student Calendar"}</h2>
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div className="calendar-grid">
            <div className="calendar-header">
              <button onClick={prevMonth}>Previous</button>
              <span>{moment(currentDate).format("MMMM YYYY")}</span>
              <button onClick={nextMonth}>Next</button>
            </div>
            <div className="calendar-days">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day ? "active" : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day || ""}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="tasks-section">
        <Tasks month={currentDate} />
      </div>
      {isModalOpen && (
        <Modal role={role} date={selectedDate} onClose={closeModal} />
      )}
    </div>
  );
}

export default CalendarPage;

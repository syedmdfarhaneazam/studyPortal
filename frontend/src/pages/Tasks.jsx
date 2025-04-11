import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { deleteTask } from "../redux/taskSlice";
import { refreshTasks } from "../redux/taskSlice";
function Tasks({ month }) {
  const { tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth); // user here
  const dispatch = useDispatch();
  // display task by month
  const filteredTasks = tasks.filter((task) =>
    moment(task.date).isSame(month, "month"),
  );
  // delete dispatch
  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId))
        .unwrap()
        .then(() => console.log("Task deleted:", taskId))
        .catch((error) => console.error("Delete error:", error));
    }
  };

  return (
    <div className="tasks">
      <h3>
        Tasks <button onClick={() => dispatch(refreshTasks())}>Refresh</button>
      </h3>
      {filteredTasks.length > 0 ? (
        <ul>
          {filteredTasks.map((task) => (
            <li key={task._id} className="card">
              <h4>Task for {moment(task.date).format("MMMM DD, YYYY")}</h4>
              <p>{task.description}</p>
              <p>Added by: {task.createdBy?.name || "Unknown Teacher"}</p>
              {user?._id === task.createdBy?._id && (
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks for this month.</p>
      )}
    </div>
  );
}

export default Tasks;

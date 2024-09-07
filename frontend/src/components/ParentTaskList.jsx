import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ParentTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [status, setStatus] = useState("MyTasks"); // Default value for the status tab
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all parent tasks on initial load
    axios
      .get("http://localhost:8080/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTasks(response.data.tasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch subtasks when the selected task or status changes
    if (selectedTask) {
      const url =
        status === "MyTasks"
          ? `http://localhost:8080/tasks/${selectedTask.id}`
          : `http://localhost:8080/tasks/${selectedTask.id}/${status}`;

      axios
        .get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          const subtasks = response.data.subTasks || response.data;
          // Sort subtasks by status
          const statusOrder = ["Completed", "In Progress", "To Do", "Postponed", "Suspended"];
          const sortedSubtasks = subtasks.sort((a, b) => {
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
          });
          setSubtasks(sortedSubtasks);
        })
        .catch((error) => {
          console.error("Error fetching subtasks:", error);
        });
    }
  }, [selectedTask, status]);

  const handleSelectTask = (task) => {
    setSelectedTask(task); // Set the selected task to trigger the useEffect
  };

  const handleDeleteTask = (taskId) => {
    // Delete a parent task
    axios
      .delete(`http://localhost:8080/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(null); // Clear selected task if deleted
          setSubtasks([]); // Clear subtasks if the selected task is deleted
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const handleDeleteSubtask = (subtaskId) => {
    // Delete a subtask
    axios
      .delete(`http://localhost:8080/subtasks/${subtaskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setSubtasks(subtasks.filter((subtask) => subtask._id !== subtaskId));
      })
      .catch((error) => {
        console.error("Error deleting subtask:", error);
      });
  };

  const handleTabChange = (newStatus) => {
    setStatus(newStatus);
    if (selectedTask) {
      // Fetch subtasks when status changes while a task is selected
      const url =
        newStatus === "MyTasks"
          ? `http://localhost:8080/tasks/${selectedTask.id}`
          : `http://localhost:8080/tasks/${selectedTask.id}/${newStatus}`;

      axios
        .get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          const subtasks = response.data.subTasks || response.data;
          // Sort subtasks by status
          const statusOrder = ["Completed", "In Progress", "To Do", "Postponed", "Suspended"];
          const sortedSubtasks = subtasks.sort((a, b) => {
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
          });
          setSubtasks(sortedSubtasks);
        })
        .catch((error) => {
          console.error("Error fetching subtasks:", error);
        });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Projects</h1>

      {/* Tabs for status */}
      <div className="mb-4">
        <button
          className={`py-2 px-4 rounded ${status === "MyTasks" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => handleTabChange("MyTasks")}
        >
          My Tasks
        </button>
        <button
          className={`py-2 px-4 rounded ${status === "Postponed" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => handleTabChange("Postponed")}
        >
          Postponed
        </button>
        <button
          className={`py-2 px-4 rounded ${status === "In Progress" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => handleTabChange("In Progress")}
        >
          In Progress
        </button>
        <button
          className={`py-2 px-4 rounded ${status === "Suspended" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => handleTabChange("Suspended")}
        >
          Suspended
        </button>
        <button
          className={`py-2 px-4 rounded ${status === "Completed" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => handleTabChange("Completed")}
        >
          Completed
        </button>
        <button
          className={`py-2 px-4 rounded ${status === "To Do" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
          onClick={() => handleTabChange("To Do")}
        >
          To Do
        </button>
      </div>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => navigate("/create-parent-task")}
      >
        Create Task
      </button>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border p-4 rounded shadow cursor-pointer ${selectedTask && selectedTask.id === task.id ? 'bg-blue-100' : ''}`}
            onClick={() => handleSelectTask(task)}
          >
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <button
              className="bg-red-500 text-white py-1 px-2 rounded mt-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click event from bubbling up to the card click handler
                handleDeleteTask(task.id);
              }}
            >
              Delete Task
            </button>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Subtasks for Task ID: {selectedTask.id}</h2>
          <table className="table-auto w-full mt-4">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subtasks.map((subtask) => (
                <tr key={subtask._id}>
                  <td>{subtask.title}</td>
                  <td>{subtask.description}</td>
                  <td>{subtask.status}</td>
                  <td>{subtask.dueDate}</td>
                  <td>
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded"
                      onClick={() => navigate(`/edit-subtask/${subtask._id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={() => handleDeleteSubtask(subtask._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParentTaskList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaCalendarAlt, FaBell, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import "./css/ParentTaskList.css";

const ParentTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [status, setStatus] = useState("MyTasks"); // Default value for the status tab
  const [parentName, setParentName] = useState("");
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL; // Access base URL from environment variable

  useEffect(() => {
    // Fetch all parent tasks on initial load
    axios
      .get(`${baseUrl}/tasks`, {
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
          ? `${baseUrl}/tasks/${selectedTask.id}`
          : `${baseUrl}/tasks/${selectedTask.id}/${status}`;

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

          // Only set parentName when it's empty (task is first selected)
          if (!parentName) {
            const parent_name = response.data.title || selectedTask.title;
            setParentName(parent_name);
          }
        })
        .catch((error) => {
          console.error("Error fetching subtasks:", error);
        });
    }
  }, [selectedTask, status]);

  const handleSelectTask = (task) => {
    setSelectedTask(task); // Set the selected task to trigger the useEffect
    setParentName(task.title); // Set the parent task name when a new task is selected
  };

  const handleDeleteTask = (taskId) => {
    // Delete a parent task
    axios
      .delete(`${baseUrl}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(null); // Clear selected task if deleted
          setSubtasks([]); // Clear subtasks if the selected task is deleted
          setParentName(""); // Clear the parent name if the selected task is deleted
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const handleDeleteSubtask = (subtaskId) => {
    // Delete a subtask
    axios
      .delete(`${baseUrl}/subtasks/${subtaskId}`, {
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
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-title">Projects</div>
      </div>
      <div className="main-content">
        <div className="status-tabs">
          {["MyTasks", "Postponed", "In Progress", "Suspended", "Completed", "To Do"].map((statusTab) => (
            <button
              key={statusTab}
              className={`status-tab ${status === statusTab ? "active" : ""}`}
              onClick={() => handleTabChange(statusTab)}
            >
              {statusTab}
            </button>
          ))}
        </div>

        <div className="create-task-container">
          <button className="create-task-button" onClick={() => navigate("/create-parent-task")}>
            <FaPlus /> Create Project
          </button>

          {selectedTask && (
            <button className="create-task-button" onClick={() => navigate(`/create-subtask/${selectedTask.id}`)}>
              <FaPlus /> Create Task
            </button>
          )}

          <button className="create-task-button" onClick={() => navigate("/calendarsubtask")}>
            <FaCalendarAlt /> Show Task for Date
          </button>
        </div>

        {/* Parent Task Slider */}
        <div className="parent-task-slider">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`parent-task-card ${selectedTask && selectedTask.id === task.id ? "selected" : ""}`}
              onClick={() => handleSelectTask(task)}
            >
              <div className="parent-task-title">
                <span className="icon"><FaEdit /></span>
                <span className="text">{task.title}</span>
              </div>
              <div className="parent-task-description">{task.description}</div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleDeleteTask(task.id);
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Subtask Display */}
        {selectedTask && (
          <div className="subtask-section">
            <h2 className="subtask-title">Subtasks for Project: {parentName}</h2>
            <div className="subtask-list">
              {subtasks.map((subtask) => (
                <div key={subtask._id} className="subtask-card">
                  <div className="subtask-title">
                    {subtask.title}
                  </div>
                  <div className="subtask-description">
                    {subtask.description}
                  </div>
                  <div className="subtask-details">
                    <span className="status">{subtask.status}</span>
                    <span className="due-date">
                      {new Date(subtask.dueDate).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  <div className="subtask-actions">
                    <button
                      className="edit-button"
                      onClick={() => navigate(`/edit-subtask/${subtask._id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="button"
                      onClick={() => handleDeleteSubtask(subtask._id)}
                    >
                      <FaTrash/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentTaskList;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ParentTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all parent tasks
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

  const handleDeleteTask = (taskId) => {
    // Delete a parent task
    axios
      .delete(`http://localhost:8080/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Parent Tasks</h1>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => navigate("/create-parent-task")}
      >
        Create Parent Task
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <button
              className="bg-blue-500 text-white py-1 px-2 rounded mt-2"
              onClick={() => navigate(`/parenttask/${task.id}`)}
            >
              View Subtasks
            </button>
            <button
              className="bg-red-500 text-white py-1 px-2 rounded mt-2 ml-2"
              onClick={() => handleDeleteTask(task.id)}
            >
              Delete Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentTaskList;

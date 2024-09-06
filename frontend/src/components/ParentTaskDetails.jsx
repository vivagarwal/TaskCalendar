import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ParentTaskDetails = () => {
  const { id } = useParams(); // Parent task ID from URL
  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the parent task and its subtasks
    axios
      .get(`http://localhost:8080/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTask(response.data);
        setSubtasks(response.data.subTasks);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
      });
  }, [id]);

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

  return (
    <div>
      {task && (
        <>
          <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
          <p>{task.description}</p>
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
        </>
      )}
    </div>
  );
};

export default ParentTaskDetails;

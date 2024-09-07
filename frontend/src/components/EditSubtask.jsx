import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditSubTask = () => {
  const { subtaskId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL; // Access base URL from environment variable


  useEffect(() => {
    // Fetch the subtask details to edit
    axios
      .get(`${baseUrl}/subtasks/${subtaskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const subtask = response.data.subtasks[0]; // Correctly access the first subtask object
        if (subtask) {
          setTitle(subtask.title);
          setDescription(subtask.description);
          setStatus(subtask.status);
          setDueDate(subtask.dueDate.slice(0, 10)); // Format the dueDate for the date input
        }
      })
      .catch((error) => {
        console.error("Error fetching subtask:", error);
      });
  }, [subtaskId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        `${baseUrl}/subtasks/${subtaskId}`,
        { title, description, status, dueDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        navigate(`/parenttasks`);
      })
      .catch((error) => {
        console.error("Error updating subtask:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Subtask</h1>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="w-full px-3 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          className="w-full px-3 py-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
          Status
        </label>
        <select
          id="status"
          className="w-full px-3 py-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Postponed">Postponed</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-gray-700 font-bold mb-2">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          className="w-full px-3 py-2 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Update
      </button>
    </form>
  );
};

export default EditSubTask;

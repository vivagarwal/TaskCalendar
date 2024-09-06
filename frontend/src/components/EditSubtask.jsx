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

  useEffect(() => {
    // Fetch the subtask details to edit
    axios
      .get(`http://localhost:8080/subtasks/${subtaskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const subtask = response.data;
        setTitle(subtask.title);
        setDescription(subtask.description);
        setStatus(subtask.status);
        setDueDate(subtask.dueDate);
      })
      .catch((error) => {
        console.error("Error fetching subtask:", error);
      });
  }, [subtaskId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        `http://localhost:8080/subtasks/${subtaskId}`,
        { title, description, status, dueDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        navigate(`/parenttask/${subtaskId}`);
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
        <input
          type="text"
          id="status"
          className="w-full px-3 py-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
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

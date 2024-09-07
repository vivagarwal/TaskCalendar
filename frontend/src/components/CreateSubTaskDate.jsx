import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateSubTaskDate = () => {
  const { parentId, date } = useParams(); // Extract both parentId and date from URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState(date || ""); // Initialize dueDate from URL or empty string
  const navigate = useNavigate();

  useEffect(() => {
    // Set dueDate if date is available in URL
    if (date) {
      setDueDate(date);
    }
  }, [date]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `http://localhost:8080/subtasks/${parentId}`, // Use parentId in URL
        { title, description, status, dueDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        navigate("/calendarsubtask");
      })
      .catch((error) => {
        console.error("Error creating subtask:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Subtask</h1>
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
        Submit
      </button>
    </form>
  );
};

export default CreateSubTaskDate;

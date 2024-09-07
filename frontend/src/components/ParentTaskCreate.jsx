import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faTasks } from "@fortawesome/free-solid-svg-icons";

const CreateParentTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL; // Access base URL from environment variable

  const handleValidation = () => {
    let valid = true;
    let errors = {};

    if (!title) {
      valid = false;
      errors.title = "Title is required";
    }

    if (!description) {
      valid = false;
      errors.description = "Description is required";
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (handleValidation()) {
      axios
        .post(
          `${baseUrl}/tasks`,
          { title, description },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        )
        .then(() => {
          navigate("/parenttasks"); // Navigate to the parent task list after creation
        })
        .catch((error) => {
          console.error("Error creating parent task:", error);
        });
    }
  };

  const handleCancel = () => {
    navigate("/parenttasks");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
          <FontAwesomeIcon icon={faTasks} className="mr-2" />
          Create Project
        </h1>
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-gray-700 font-semibold mb-2"
          >
            Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              className={`w-full px-4 py-3 pl-10 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faTasks}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-sm mt-2">{errors.title}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-2"
          >
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              className={`w-full px-4 py-3 pl-10 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <FontAwesomeIcon
              icon={faTasks}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-sm mt-2">{errors.description}</p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 focus:outline-none flex items-center"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateParentTask;

import React, { useState } from "react";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarSubTask = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [subtasks, setSubtasks] = useState([]);
  const [filteredSubtasks, setFilteredSubtasks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('MyTasks'); // Default tab

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchSubTasks = (date) => {
    const formattedDate = formatDate(date);
    console.log(formattedDate);

    axios
      .get(`http://localhost:8080/subtasks/by-date/${formattedDate}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setSubtasks(response.data);
        setFilteredSubtasks(filterSubtasks(response.data, selectedTab));
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching subtasks:", error);
        setError("Failed to fetch subtasks. Please try again.");
        setSubtasks([]);
        setFilteredSubtasks([]);
      });
  };

  const filterSubtasks = (subtasks, tab) => {
    switch (tab) {
      case 'In Progress':
        return subtasks.filter(subtask => subtask.status === 'In Progress');
      case 'Completed':
        return subtasks.filter(subtask => subtask.status === 'Completed');
      case 'To Do':
        return subtasks.filter(subtask => subtask.status === 'To Do');
      case 'MyTasks':
      default:
        return subtasks;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchSubTasks(date);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setFilteredSubtasks(filterSubtasks(subtasks, tab));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Subtasks by Date</h1>

      <div className="mb-4">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>

      <div className="mb-4 flex space-x-4 border-b border-gray-300">
        {['MyTasks', 'In Progress', 'Completed', 'To Do'].map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 font-semibold rounded-t-lg ${
              selectedTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        {filteredSubtasks.length === 0 && !error && (
          <p>No subtasks found for the selected date and tab.</p>
        )}
        {filteredSubtasks.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {filteredSubtasks.map((subtask) => (
              <div
                key={subtask._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-300"
              >
                <h2 className="text-xl font-bold mb-2">{subtask.title}</h2>
                <p className="text-gray-700 mb-1">Description: {subtask.description}</p>
                <p className="text-gray-700 mb-1">Status: {subtask.status}</p>
                <p className="text-gray-700 mb-1">Parent Task: {subtask.parentTask.title}</p>
                <p className="text-gray-500">Due Date: {new Date(subtask.dueDate).toLocaleDateString('en-GB')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarSubTask;

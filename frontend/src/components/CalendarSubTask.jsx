import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router-dom";

const CalendarSubTask = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [subtasks, setSubtasks] = useState([]);
  const [filteredSubtasks, setFilteredSubtasks] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('MyTasks');
  const [parentTasks, setParentTasks] = useState([]);
  const [showParentTasksDropdown, setShowParentTasksDropdown] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchSubTasks(selectedDate);
  }, [selectedDate, selectedTab]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchSubTasks = (date) => {
    const formattedDate = formatDate(date);

    axios
      .get(`${baseUrl}/subtasks/by-date/${formattedDate}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const statusOrder = ["Completed", "In Progress", "To Do", "Postponed", "Suspended"];
        const sortedSubtasks = response.data.sort((a, b) => 
          statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        );
        setSubtasks(sortedSubtasks);
        setFilteredSubtasks(filterSubtasks(sortedSubtasks, selectedTab));
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching subtasks:", error);
        setError("Failed to fetch subtasks. Please try again.");
        setSubtasks([]);
        setFilteredSubtasks([]);
      });
  };

  const fetchParentTasks = () => {
    axios
      .get(`${baseUrl}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const tasks = response.data.tasks;
        if (tasks.length === 0) {
          window.alert("There are no projects to create a task. Please create one and try again.");
        } else {
          setParentTasks(tasks);
          setShowParentTasksDropdown(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching parent tasks:", error);
        setError("Failed to fetch parent tasks. Please try again.");
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
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleCreateTaskClick = () => {
    if (showParentTasksDropdown) {
      setShowParentTasksDropdown(false);
    } else {
      fetchParentTasks();
    }
  };

  const handleDropdownItemClick = (task) => {
    setSelectedParentTask(task);
    setShowParentTasksDropdown(false);
    const formattedDate = formatDate(selectedDate);
    navigate(`/create-subtask/${task.id}/${formattedDate}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Subtasks by Date</h1>

      <div className="relative mb-6">
        <button
          onClick={handleCreateTaskClick}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Create Task
        </button>

        {showParentTasksDropdown && parentTasks.length === 0 && (
          <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-gray-300 z-10 px-4 py-2">
            <p className="text-red-600">There are no projects to create a task. Please create one and try again.</p>
          </div>
        )}

        {showParentTasksDropdown && parentTasks.length > 0 && (
          <div className="absolute mt-2 bg-white shadow-lg rounded-lg border border-gray-300 z-10">
            <ul className="max-h-60 overflow-y-auto">
              {parentTasks.map(task => (
                <li
                  key={task.id}
                  onClick={() => handleDropdownItemClick(task)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mb-6 w-full max-w-md">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-6 flex space-x-4 border-b border-gray-300 pb-2">
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

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="w-full max-w-2xl">
        {filteredSubtasks.length === 0 && !error && (
          <p className="text-gray-600">No subtasks found for the selected date and tab.</p>
        )}
        {filteredSubtasks.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {filteredSubtasks.map((subtask) => (
              <div
                key={subtask._id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-300"
              >
                <h2 className="text-2xl font-bold mb-2">{subtask.title}</h2>
                <p className="text-gray-700 mb-1">Description: {subtask.description}</p>
                <p className="text-gray-700 mb-1">Status: <span className={`font-semibold ${subtask.status === 'Completed' ? 'text-green-600' : subtask.status === 'In Progress' ? 'text-yellow-600' : subtask.status === 'To Do' ? 'text-blue-600' : subtask.status === 'Postponed' ? 'text-orange-600' : 'text-gray-600'}`}>{subtask.status}</span></p>
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

import React from "react";
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ParentTaskList from "./components/ParentTaskList";
import ParentTaskCreate from "./components/ParentTaskCreate";
import EditSubTask from "./components/EditSubtask";
import CreateSubTask from "./components/CreateSubTask";
import CalendarSubTask from "./components/CalendarSubTask";
import CreateSubTaskDate from "./components/CreateSubTaskDate";
import './index.css';

const App = () => {
  return (
    <div>
      <Navbar/>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/parenttasks" element={<ParentTaskList />} />
          <Route path="/create-parent-task" element={<ParentTaskCreate />} />
          <Route path="/edit-subtask/:subtaskId" element={<EditSubTask />} />
          <Route path="/create-subtask/:parentId" element={<CreateSubTask />} />
          <Route path="/create-subtask/:parentId/:date" element={<CreateSubTaskDate />} />  
          <Route path="/calendarsubtask" element={<CalendarSubTask />} />
        </Routes>
      </div> 
    </div>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;

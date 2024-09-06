import React from "react";
import { BrowserRouter, Routes, Route , useLocation , Navigate} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ParentTaskList from "./components/ParentTaskList";
import ParentTaskDetails from "./components/ParentTaskDetails";
import ParentTaskCreate from "./components/ParentTaskCreate";
import EditSubTask from "./components/EditSubtask";
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
          <Route path="/parenttask/:id" element={<ParentTaskDetails />} />
          <Route path="/create-parent-task" element={<ParentTaskCreate />} />
          <Route path="/edit-subtask/:subtaskId" element={<EditSubTask />} />
      
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

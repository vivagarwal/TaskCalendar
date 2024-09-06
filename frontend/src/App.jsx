import React from "react";
import { BrowserRouter, Routes, Route , useLocation , Navigate} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import TaskCalendar from "./components/TaskCalendar";
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
          <Route path="/taskcalendar" element={<TaskCalendar/>}/>
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

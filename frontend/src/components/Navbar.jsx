import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import "./css/ParentTaskList.css";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Parse the user object from localStorage
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <Link to="/parenttasks" className="text-white font-bold text-2xl flex items-center">
              <FaHome className="mr-2" /> Task Calendar
            </Link>
            {user && (
              <p className="text-white text-sm mt-1 flex items-center">
                <FaUser className="mr-1" /> Hello, {user.fullname}
              </p>
            )}
          </div>
          <ul className="flex space-x-4 items-center">
            {user ? (
              <>
                <li>
                  <button
                    className="bg-purple-700 hover:bg-purple-500 text-white px-3 py-2 rounded flex items-center"
                    onClick={() => navigate("/calendarsubtask")}
                  >
                    <FaCalendarAlt className="mr-1" /> Show Task for Date
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center"
                  >
                    <FaSignOutAlt className="mr-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                 <li>
                  <Link className="text-white hover:text-gray-300" to="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white hover:text-gray-300"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

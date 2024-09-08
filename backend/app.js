const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { DBConnection } = require("./database/db.js");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.js');
const authMiddleware = require('./middleware/auth.js');
const parentTaskRoutes = require('./routes/tasks.js');
const subTaskRoutes = require('./routes/subtasks.js')

dotenv.config();

// Only connect to the database if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
    DBConnection(); //Db connection
}

const app = express();

// Configure CORS to allow credentials
app.use(cors({
    origin:['http://localhost:5173', 'https://taskcalendar-frontend.onrender.com'],//your frontend url
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', authRoutes);
app.use('/tasks',authMiddleware,parentTaskRoutes)
app.use('/subtasks',authMiddleware,subTaskRoutes)

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Task Calendar Management" });
});

module.exports = app;
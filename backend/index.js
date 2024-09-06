const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { DBConnection } = require("./database/db.js");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.js');
const router = express.Router();
dotenv.config();

DBConnection(); //Db connection

const app = express();
const PORT = process.env.PORT || 8080;

// Configure CORS to allow credentials
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Task Calendar Management" });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
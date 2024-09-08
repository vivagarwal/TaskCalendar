# TaskCalendar

TaskCalendar is a full-stack task management application designed to help users organize tasks and events on a calendar interface. Built with a React frontend and an Express backend, this application leverages MongoDB for data storage and implements JWT-based authentication for secure user management.

## Features

- User authentication using JWT
- Task and event management
- MongoDB integration for data persistence
- CI/CD compatible with testing

## Core Features

- User Authentication: Secure login and registration using JWT, ensuring that only authorized users can access task data.
- Task and Event Management: Users can create, edit, and delete tasks or events, view them on a calendar, and manage deadlines.
- MongoDB Integration: All data, including user credentials, tasks, and events, is stored in a MongoDB database, offering robust data persistence.
- Responsive UI: The frontend is built with React, ensuring a responsive and dynamic user interface.

## Technology Stack

- Frontend: React, HTML, CSS, and JavaScript.
- Backend: Node.js, Express.js.
- Database: MongoDB.
- Authentication: JSON Web Tokens (JWT).

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [MongoDB](https://www.mongodb.com/) (v4.4 or later)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the git repository:**

Clone the repository to your local machine:

```bash
git clone https://github.com/vivagarwal/TaskCalendar.git
```

2. **Navigate to the project directory:**

    ```bash
    cd TaskCalendar
    ```

3. **Navigate to the backend directory and install the required dependencies:**

    ```bash
    cd backend
    npm install
    ```

4. **Configure Environment Variables for backend**

Create a .env file in the backend directory and add the following:

    MONGO_URI=mongodb://localhost:27017/your_database_name 
    SECRET_KEY=your_secret_key
    

5. **Frontend Setup**

Navigate to the frontend directory and install the required dependencies:

    cd ../frontend
    npm install
    

6. **Configure Environment Variables for fronyend**

Create a .env file in the frontend directory and add the following:

    VITE_BASE_URL=your_backend_url

7. **Run MongoDB locally**

Ensure MongoDB is running on your local machine:

On macOS
    brew services start mongodb/brew/mongodb-community
    
On windows
    net start MongoDB
    
On Ubuntu
    sudo systemctl start mongod
    

8. **Running the application**

Start the Backend Server

In the backend directory, run:
    ```bash
    npm start
    ```

Start the Frontend Server

In the frontend directory, run:
    ```bash
    npm start
    ```

## Screenshots

Below are some screenshots of the application:




## Configuration

You can configure the application settings in the `appsettings.json` file located in the root directory. Make sure to set up any necessary database connections or other settings as required.

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request with your changes. Make sure to follow the coding conventions and add appropriate tests for your changes.


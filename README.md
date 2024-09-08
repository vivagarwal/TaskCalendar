# TaskCalendar

TaskCalendar is a full-stack task management application designed to help users organize tasks and events on a calendar interface. Built with a React frontend and an Express backend, this application leverages MongoDB for data storage and implements JWT-based authentication for secure user management.

Deployment link - https://taskcalendar-frontend.onrender.com

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
```
MONGO_URI=mongodb://localhost:27017/your_database_name 
SECRET_KEY=your_secret_key
```    

5. **Frontend Setup**

Navigate to the frontend directory and install the required dependencies:
```
cd ../frontend
npm install
```    

6. **Configure Environment Variables for fronyend**

Create a .env file in the frontend directory and add the following:
```
VITE_BASE_URL=your_backend_url
```

7. **Run MongoDB locally**

Ensure MongoDB is running on your local machine:

On macOS
```
brew services start mongodb/brew/mongodb-community
```

On windows
```
net start MongoDB
```

On Ubuntu
```
sudo systemctl start mongod
``` 

8.**Running the application**

Start the Backend Server

In the backend directory, run:
```
npm start
```

Start the Frontend Server

In the frontend directory, run:
```
npm start
```

9. **I have added the test cases for backend**

Command to run the test for backend
In the backend directory, run:
```
npm test
```
To see the test coverage
```
npm test -- -- coverage
```

**Test Coverage Screenhort**
<img width="754" alt="Screenshot 2024-09-08 at 9 16 38 PM" src="https://github.com/user-attachments/assets/3ac44bb8-253a-4769-8d9b-d4a2bb54d838">

## Screenshots

Below are some screenshots of the application:

**Register Page**: 
<img width="1470" alt="Screenshot 2024-09-08 at 1 57 11 PM" src="https://github.com/user-attachments/assets/e18c4202-cbb3-4f0b-bb1a-10643dd4ae20">

**Login Page**
<img width="1470" alt="Screenshot 2024-09-08 at 1 56 29 PM" src="https://github.com/user-attachments/assets/aaf6da7f-5da4-4076-b3a5-003bde238c73">

**Invalid Credentials Provided**
<img width="1470" alt="Screenshot 2024-09-08 at 1 58 31 PM" src="https://github.com/user-attachments/assets/193cdc9b-677f-40b2-95ed-d75d76243480">

<img width="1470" alt="Screenshot 2024-09-08 at 1 59 35 PM" src="https://github.com/user-attachments/assets/e8fd2439-4be6-4a32-b64f-7b9c3cb68416">

**HomePage for logged in user**
<img width="1470" alt="Screenshot 2024-09-08 at 2 02 54 PM" src="https://github.com/user-attachments/assets/33796219-88f1-4e17-bb2c-432c3742794b">

<img width="1470" alt="Screenshot 2024-09-08 at 2 03 26 PM" src="https://github.com/user-attachments/assets/5bc31892-b071-4bf2-9e61-114821831995">

**Subtask shown whe particular project is selected**
<img width="1470" alt="Screenshot 2024-09-08 at 2 07 52 PM" src="https://github.com/user-attachments/assets/d2681005-5740-4020-8b0b-be63ff36921e">

**Subtask shown whe particular project is selected and also subtask status is selected**
<img width="1470" alt="Screenshot 2024-09-08 at 2 08 03 PM" src="https://github.com/user-attachments/assets/71ecf947-d658-42e1-8677-63e8121a6a6d">

<img width="1470" alt="Screenshot 2024-09-08 at 2 08 07 PM" src="https://github.com/user-attachments/assets/0871a3b0-f1ed-4b98-bb97-bc14141947f8">

<img width="1470" alt="Screenshot 2024-09-08 at 2 08 10 PM" src="https://github.com/user-attachments/assets/95250522-e5b3-40e8-9d27-46888ec07edb">

**show all task for particular date homepage**
<img width="1470" alt="Screenshot 2024-09-08 at 2 08 14 PM" src="https://github.com/user-attachments/assets/947e5e12-a458-471b-a704-0978ab01555a">

**show all task for particular date selected**
<img width="1470" alt="Screenshot 2024-09-08 at 2 08 41 PM" src="https://github.com/user-attachments/assets/4bef9e48-a1e8-4bba-98d0-aff32ce58599">

<img width="1470" alt="Screenshot 2024-09-08 at 2 08 50 PM" src="https://github.com/user-attachments/assets/cf09bd1a-6c58-4e92-b9e0-0b939f2c3547">

<img width="1470" alt="Screenshot 2024-09-08 at 2 09 39 PM" src="https://github.com/user-attachments/assets/0b6f4e38-6c99-4dd8-acd3-673b744d82f0">

**User can create task for particular project for selected date**
<img width="1470" alt="Screenshot 2024-09-08 at 2 10 11 PM" src="https://github.com/user-attachments/assets/e9235ce2-1006-408e-a30a-2f53b88b0346">

**logout page**
<img width="1470" alt="Screenshot 2024-09-08 at 2 12 55 PM" src="https://github.com/user-attachments/assets/da47fcb5-6901-4995-a153-0b5e9ec126e6">

## Contributing

If you would like to contribute to this project, please fork the repository and create a pull request with your changes. Make sure to follow the coding conventions and add appropriate tests for your changes.


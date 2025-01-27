# Task Management Application

## Overview
The **Task Management Application** is a complete solution that combines a robust RESTful API with a responsive frontend interface for managing tasks. The backend, built using **Node.js** and **MongoDB**, provides secure user authentication and task management, while the frontend, developed using **React.js**, offers a seamless user experience for interacting with the API.

---

## Features

### Backend Features:
- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete) for tasks.
- **Access Control**: Only the creator of a task can modify or delete it.
- **Swagger Documentation**: Interactive API documentation via Swagger UI.
- **Data Storage**: Persistent storage using **MongoDB** with Mongoose ODM.
- **Validation**: Input data is validated to ensure correctness and prevent invalid operations.
- **Logging**: Logs all API operations (e.g., creation, updates, deletions) for tracking and debugging.
- **Environment Configurations**: Configurations managed using `.env` files for easy setup.

### Frontend Features:
- **Responsive Interface**: User-friendly interface built with **React.js**.
- **Authentication**: Login and register functionality integrated with the backend API.
- **Task Management**: 
  - View all tasks in a paginated format.
  - Create, update, and delete tasks directly from the frontend.
  - View details of individual tasks.
- **Protected Routes**: Access to task management is restricted to authenticated users only.
- **Dynamic Forms**: Create and edit tasks using easy-to-use forms.
- **Error Handling**: Displays appropriate error messages for failed actions.

---

## Endpoints (Backend)

### **Authentication**
| Endpoint               | Method | Description                           |
|------------------------|--------|---------------------------------------|
| `/api/auth/register`   | POST   | Register a new user.                  |
| `/api/auth/login`      | POST   | Login and retrieve a JWT token.       |

### **Tasks**
| Endpoint               | Method | Description                                |
|------------------------|--------|--------------------------------------------|
| `/api/tasks`           | GET    | Retrieve all tasks for the logged-in user. |
| `/api/tasks/:id`       | GET    | Retrieve a specific task by ID.            |
| `/api/tasks`           | POST   | Create a new task.                         |
| `/api/tasks/:id`       | PUT    | Update an existing task by ID.             |
| `/api/tasks/:id`       | DELETE | Delete a task by ID.                       |

---

## Frontend Routes

| Route             | Description                                              |
|-------------------|----------------------------------------------------------|
| `/register`       | User registration page.                                  |
| `/login`          | User login page.                                         |
| `/tasks`          | Displays a paginated list of all tasks.                  |
| `/tasks/:id`      | Displays details for a specific task and allows editing. |

---

## Swagger Documentation
The backend API is documented using **Swagger**. It provides an interactive interface for exploring and testing the API.

### Access Swagger Documentation:
- Navigate to: `http://localhost:5000/api-docs`
- Explore and test all available endpoints interactively.

---

## Getting Started
-- `npm start` for concurrent running of both the scripts
-- Navigate to: ``http://localhost:5713/`

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or hosted, e.g., MongoDB Atlas)

### Backend Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Manav7603/Taskmanager1.git
   cd Taskmanager1

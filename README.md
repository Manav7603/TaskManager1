# Task Management API

## Overview
The **Task Management API** is a robust RESTful service designed to facilitate user authentication and task management. It allows users to securely manage their tasks, with strict access controls ensuring only the creator of a task can modify or delete it. The API uses **MongoDB** for data storage and includes features like logging, validation, and flexible environment configurations.

## Features
- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete) for tasks.
- **Access Control**: Only the creator of a task can modify or delete it.
- **Swagger Documentation**: Interactive API documentation via Swagger UI.
- **Data Storage**: Persistent storage using **MongoDB** with Mongoose ODM.
- **Validation**: Input data is validated to ensure correctness and prevent invalid operations.
- **Logging**: Logs all API operations (e.g., creation, updates, deletions) for tracking and debugging.
- **Environment Configurations**: Configurations managed using `.env` files for easy setup.

---

## Endpoints

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

## Swagger Documentation
The API is documented using **Swagger** and can be accessed via the `/api-docs` endpoint. The documentation provides an interactive interface for exploring and testing the API.

### Access Swagger Documentation:
- Navigate to: `http://localhost:5000/api-docs`
- Explore and test all available endpoints interactively.

---

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or hosted, e.g., MongoDB Atlas)

### Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Manav7603/Taskmanager1.git
   cd Taskmanager1

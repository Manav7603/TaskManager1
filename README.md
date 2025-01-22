# Task Management API


## Overview
The **Task Management API** is a RESTful service designed to handle user authentication and task management, allowing users to securely create, update, and delete their tasks. The API enforces strict access control, ensuring that only the creator of a task can modify or delete it. It uses **MongoDB** for data storage and includes robust logging for tracking operations.


## Features
- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete) for tasks.
- **Access Control**: Only the creator of a task can modify or delete it.
- **Data Storage**: Persistent storage with **MongoDB** using Mongoose ODM.
- **Logging**: Logs all API operations (e.g., creation, updates, deletions) in a text file for tracking and debugging.
- **Validation**: Input data is validated to ensure correctness.
- **Environment Configurations**: Flexible configurations using `.env` files.


## Endpoints

## API Endpoints

### **Authentication**
| Endpoint               | Method | Description                |
|------------------------|--------|----------------------------|
| `/api/auth/register`   | POST   | Register a new user.       |
| `/api/auth/login`      | POST   | Login and retrieve a JWT.  |

### **Tasks**
| Endpoint               | Method | Description                                |
|------------------------|--------|--------------------------------------------|
| `/api/tasks`           | GET    | Retrieve all tasks for the logged-in user. |
| `/api/tasks/:id`       | GET    | Retrieve a specific task by ID.            |
| `/api/tasks`           | POST   | Create a new task.                         |
| `/api/tasks/:id`       | PUT    | Update an existing task by ID.             |
| `/api/tasks/:id`       | DELETE | Delete a task by ID.                       |

---


## Setup
1. Clone the repo.
2. Install dependencies: `npm install`.
3. Add environment variables in `.env`.
4. Start the server: `npm run dev`.


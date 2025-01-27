import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  const addTask = (newTask) => setTasks([...tasks, newTask]);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await axios.patch(`/api/tasks/${id}`);
      setTasks(tasks.map(task => 
        task._id === id ? { ...task, completed: res.data.completed } : task
      ));
    } catch (err) {
      console.error(err);
    }
  };

// Modify the render section:
return (
  <div className="task-manager">
    <h1>Task Manager</h1>
    <TaskForm addTask={addTask} />
    {loading ? (
      <p>Loading...</p>
    ) : tasks.length > 0 ? (
      tasks.map(task => (
        <Task 
          key={task._id} 
          task={task} 
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
        />
      ))
    ) : (
      <p>No tasks found. Add your first task!</p>
    )}
  </div>
);
};

export default TaskList;
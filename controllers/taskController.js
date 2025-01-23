const Task = require('../models/Task');
const fs = require('fs');
const path = require('path');

const logToFile = (message) => {
  const logPath = path.join(__dirname, '../logs/app.log');
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
};


exports.getAllTasks = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default values: page 1, 10 tasks per page
  
      const tasks = await Task.find({ user: req.user.id })
        .skip((page - 1) * limit) // Skip tasks from previous pages
        .limit(parseInt(limit)) // Limit the number of tasks
        .sort({ created_at: -1 }); // Optional: Sort by newest tasks first
  
      const totalTasks = await Task.countDocuments({ user: req.user.id }); // Total tasks count for the user
  
      res.json({
        tasks,
        pagination: {
          totalTasks,
          totalPages: Math.ceil(totalTasks / limit),
          currentPage: parseInt(page),
        },
      });
  
      logToFile(`Fetched tasks for page ${page} with limit ${limit}`);
    } catch (error) {
      res.status(500).json({ error: error.message });
      logToFile(`Error fetching tasks: ${error.message}`);
    }
  };

 

exports.getTaskById = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.json(task);
      logToFile(`Fetched task with ID: ${req.params.id}`);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      logToFile(`Error fetching task: ${error.message}`);
    }
  };
  

exports.createTask = async (req, res) => {
    try {
      const { title, description, status } = req.body;
  
      // Validate input
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }
  
      const task = new Task({
        title,
        description,
        status: status || 'Pending',
        user: req.user.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
  
      await task.save();
      res.status(201).json(task);
      logToFile('Created a new task');
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      logToFile(`Error creating task: ${error.message}`);
    }
  };




exports.updateTask = async (req, res) => {
    try {
      const { title, description, status } = req.body;
      const taskId = req.params.id;
  
      // Validate input
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }
  
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      if (task.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'You are not authorized to update this task' });
      }
  
      task.title = title;
      task.description = description;
      task.status = status || task.status;
      task.updated_at = new Date();
  
      await task.save();
      res.json(task);
      logToFile(`Updated task with ID: ${taskId}`);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      logToFile(`Error updating task: ${error.message}`);
    }
  };

  


exports.deleteTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      if (task.user.toString() !== req.user.id) {
        return res.status(403).json({ error: 'You are not authorized to delete this task' });
      }
  
      await task.remove();
      res.json({ message: 'Task deleted' });
      logToFile(`Deleted task with ID: ${req.params.id}`);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      logToFile(`Error deleting task: ${error.message}`);
    }
  };
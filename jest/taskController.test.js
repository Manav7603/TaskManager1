const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('../server/controllers/taskController');
const Task = require('../server/models/Task');
const fs = require('fs');
const path = require('path');

// Mock the Task model and fs module
jest.mock('../server/models/Task');
jest.mock('fs');

// Mocks for the request, response, and next functions
let req, res, next;
beforeEach(() => {
  req = {
    user: { id: 'userId' },
    params: {},
    body: {},
    query: {},
  };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  next = jest.fn();
});

describe('Task Controller', () => {
  // Test case for getAllTasks
  describe('getAllTasks', () => {
    it('should fetch tasks with pagination', async () => {
      Task.find.mockResolvedValueOnce([{ title: 'Task 1' }, { title: 'Task 2' }]);
      Task.countDocuments.mockResolvedValueOnce(2);
      req.query.page = 1;
      req.query.limit = 2;

      await getAllTasks(req, res);

      expect(res.json).toHaveBeenCalledWith({
        tasks: [{ title: 'Task 1' }, { title: 'Task 2' }],
        pagination: {
          totalTasks: 2,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });

    it('should handle errors gracefully', async () => {
      Task.find.mockRejectedValueOnce(new Error('Error fetching tasks'));

      await getAllTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching tasks' });
    });
  });

  // Test case for getTaskById
  describe('getTaskById', () => {
    it('should fetch a task by ID', async () => {
      req.params.id = 'taskId';
      Task.findById.mockResolvedValueOnce({ title: 'Test Task' });

      await getTaskById(req, res);

      expect(res.json).toHaveBeenCalledWith({ title: 'Test Task' });
    });

    it('should return 404 if task is not found', async () => {
      req.params.id = 'taskId';
      Task.findById.mockResolvedValueOnce(null);

      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should handle errors gracefully', async () => {
      req.params.id = 'taskId';
      Task.findById.mockRejectedValueOnce(new Error('Error fetching task'));

      await getTaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  // Test case for createTask
  describe('createTask', () => {
    it('should create a new task', async () => {
      req.body = { title: 'New Task', description: 'Task description' };
      Task.prototype.save.mockResolvedValueOnce({ title: 'New Task', description: 'Task description' });

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task description',
      });
    });

    it('should return 400 if title or description is missing', async () => {
      req.body = { title: '' };

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Title and description are required' });
    });

    it('should handle errors gracefully', async () => {
      req.body = { title: 'New Task', description: 'Task description' };
      Task.prototype.save.mockRejectedValueOnce(new Error('Error creating task'));

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  // Test case for updateTask
  describe('updateTask', () => {
    it('should update the task successfully', async () => {
      req.params.id = 'taskId';
      req.body = { title: 'Updated Task', description: 'Updated description' };
      Task.findById.mockResolvedValueOnce({ title: 'Old Task', description: 'Old description', user: { toString: () => 'userId' } });
      Task.prototype.save.mockResolvedValueOnce({ title: 'Updated Task', description: 'Updated description' });

      await updateTask(req, res);

      expect(res.json).toHaveBeenCalledWith({
        title: 'Updated Task',
        description: 'Updated description',
      });
    });

    it('should return 404 if task not found', async () => {
      req.params.id = 'taskId';
      Task.findById.mockResolvedValueOnce(null);

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should return 403 if user is not authorized', async () => {
      req.params.id = 'taskId';
      req.body = { title: 'Updated Task' };
      Task.findById.mockResolvedValueOnce({ title: 'Old Task', user: { toString: () => 'otherUserId' } });

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to update this task' });
    });

    it('should handle errors gracefully', async () => {
      req.params.id = 'taskId';
      Task.findById.mockRejectedValueOnce(new Error('Error updating task'));

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  // Test case for deleteTask
  describe('deleteTask', () => {
    it('should delete the task successfully', async () => {
      req.params.id = 'taskId';
      Task.findById.mockResolvedValueOnce({ user: { toString: () => 'userId' }, remove: jest.fn() });

      await deleteTask(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted' });
    });

    it('should return 404 if task not found', async () => {
      req.params.id = 'taskId';
      Task.findById.mockResolvedValueOnce(null);

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should return 403 if user is not authorized', async () => {
      req.params.id = 'taskId';
      Task.findById.mockResolvedValueOnce({ user: { toString: () => 'otherUserId' } });

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to delete this task' });
    });

    it('should handle errors gracefully', async () => {
      req.params.id = 'taskId';
      Task.findById.mockRejectedValueOnce(new Error('Error deleting task'));

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });
});

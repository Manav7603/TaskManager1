const mongoose = require('mongoose');
const Task = require('../server/models/Task'); // Adjust path if necessary

beforeAll(async () => {
  // Connect to a test database before running tests
  await mongoose.connect('mongodb+srv://manavjpandya7603:Manav7603@cluster0.vwmly.mongodb.net/Task_Management?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Close the connection after tests are done
  await mongoose.connection.close();
});

describe('Task Model', () => {
  it('should create a task with required fields', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'This is a test task.',
      user: new mongoose.Types.ObjectId(), // Mock user ID
    };

    const task = new Task(taskData);

    // Save the task to the database
    const savedTask = await task.save();

    // Validate task properties
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.description).toBe(taskData.description);
    expect(savedTask.status).toBe('Pending'); // Default value
    expect(savedTask.user.toString()).toBe(taskData.user.toString());
    expect(savedTask.created_at).toBeDefined();
    expect(savedTask.updated_at).toBeDefined();
  });

  it('should set default status to "Pending"', async () => {
    const taskData = {
      title: 'Task with default status',
      description: 'This task will have the default status.',
      user: new mongoose.Types.ObjectId(), // Mock user ID
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    // Check if default status is "Pending"
    expect(savedTask.status).toBe('Pending');
  });

  it('should update task fields correctly', async () => {
    const taskData = {
      title: 'Task to be updated',
      description: 'This task will be updated later.',
      user: new mongoose.Types.ObjectId(), // Mock user ID
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    savedTask.status = 'Completed';
    savedTask.updated_at = Date.now(); // Mock an update to the task
    const updatedTask = await savedTask.save();

    // Check if the task was updated
    expect(updatedTask.status).toBe('Completed');
    // expect(updatedTask.updated_at).not.toBe(savedTask.updated_at);
  });
});

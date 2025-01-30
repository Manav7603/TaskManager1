const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path if necessary
jest.setTimeout(30000);
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

beforeEach(async () => {
  // Clean up the database to avoid duplicate entries between tests
  await User.deleteMany({});
});

describe('User Model', () => {
  it('should hash the password before saving', async () => {
    const password = 'testPassword123';
    const user = new User({ username: `testuser${Date.now()}`, password });  // Using a unique username

    // Save the user
    await user.save();

    // Check if the password is hashed
    expect(user.password).not.toBe(password);
    expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format check
  });

  it('should correctly compare the password', async () => {
    const password = 'testPassword123';
    const user = new User({ username: `testuser${Date.now()}`, password });  // Using a unique username

    // Save the user to hash the password
    await user.save();

    // Test correct password comparison
    const isMatch = await user.comparePassword(password);
    expect(isMatch).toBe(true);

    // Test incorrect password comparison
    const wrongPassword = 'wrongPassword';
    const isWrongMatch = await user.comparePassword(wrongPassword);
    expect(isWrongMatch).toBe(false);
  });
});

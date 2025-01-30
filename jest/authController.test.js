const { register, login } = require('../server/controllers/authController');
const User = require('../server/models/User');
const jwt = require('jsonwebtoken');

// Mock User model and jwt.sign
jest.mock('../server/models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  // Test case for register
  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = { username: '`testuser${Date.now()}`', password: 'password123' };
      User.prototype.save.mockResolvedValueOnce({ username: '`testuser${Date.now()}`' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should return 400 if there is an error during registration', async () => {
      req.body = { username: '`testuser${Date.now()}`', password: 'password123' };
      User.prototype.save.mockRejectedValueOnce(new Error('Error registering user'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error registering user' });
    });
  });

  // Test case for login
  describe('login', () => {
    it('should login a user and return a token', async () => {
      req.body = { username: '`testuser${Date.now()}`', password: 'password123' };
      const mockUser = {
        _id: 'userId',
        username: '`testuser${Date.now()}`',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValueOnce(mockUser);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: 'fake-jwt-token' });
    });

    it('should return 401 if credentials are invalid', async () => {
      req.body = { username: '`testuser${Date.now()}`', password: 'password123' };
      User.findOne.mockResolvedValueOnce(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 500 if there is a server error during login', async () => {
      req.body = { username: '`testuser${Date.now()}`', password: 'password123' };
      User.findOne.mockRejectedValueOnce(new Error('Error logging in'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error logging in' });
    });
  });
});

const jwt = require('jsonwebtoken');
const { protect } = require('../middlewares/authMiddleware.js'); // Adjust the path if necessary
const User = require('../models/User');
jest.setTimeout(30000);
jest.mock('jsonwebtoken'); // Mock jwt.verify
jest.mock('../models/User'); // Mock User.findById

describe('Protect Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Set up mock req, res, and next functions
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', async () => {
    req.headers.authorization = undefined;

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
  });

  it('should return 401 if the token is invalid', async () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should return 401 if the user is not found', async () => {
    req.headers.authorization = 'Bearer validtoken';
    jwt.verify.mockImplementationOnce(() => ({ id: '12345' }));
    User.findById.mockResolvedValueOnce(null); // Simulate user not found

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should call next if the token is valid and the user is found', async () => {
    req.headers.authorization = 'Bearer validtoken';
    jwt.verify.mockImplementationOnce(() => ({ id: '12345' }));
    User.findById.mockResolvedValueOnce({ id: '12345', username: '`testuser${Date.now()}`' });

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

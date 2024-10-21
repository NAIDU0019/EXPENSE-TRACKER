const request = require('supertest');
const app = require('../app');
const User = require('../models/UseModel');
jest.mock('../models/UserModel', () => {
    return {
      findOne: jest.fn(),
      prototype: {
        save: jest.fn()
      }
    };
  });
  

describe('POST /api/users/register', () => {
  beforeEach(() => {
    User.findOne.mockClear();
    User.prototype.save.mockClear();
  });

  it('should register a new user', async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save.mockResolvedValue({});

    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        mobile: '1234567890',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully!');
  });

  it('should not allow duplicate emails', async () => {
    User.findOne.mockResolvedValue({ email: 'johndoe@example.com' });

    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        mobile: '1234567890',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User with this email already exists');
  });
});
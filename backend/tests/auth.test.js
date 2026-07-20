require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Use a unique email each run so repeated test runs don't collide
const testEmail = `test_${Date.now()}@stayfresh-test.com`;
const testPassword = 'testpass123';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  // Clean up the test user we created, then close the connection
  await User.deleteOne({ email: testEmail });
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('rejects registration with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail }); // missing fullName and password

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it('creates a new account with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/account created/i);
  });

  it('rejects a duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('rejects login with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testEmail });

    expect(res.statusCode).toBe(400);
  });

  it('rejects login before email verification', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/verify/i);
  });

  it('logs in successfully once verified', async () => {
    // Manually verify the test user, bypassing the email step for this test
    await User.updateOne({ email: testEmail }, { isVerified: true });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects an incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
  });
});

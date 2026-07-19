const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');

const testEmail = `profiletest_${Date.now()}@stayfresh-test.com`;
let testUserId;
let authToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Create a pre-verified test user directly, skipping the register/verify flow
  const user = await User.create({
    fullName: 'Profile Test User',
    email: testEmail,
    password: 'hashed_not_used_here',
    isVerified: true,
  });
  testUserId = user._id;

  authToken = jwt.sign(
    { userId: testUserId, email: testEmail },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await User.deleteOne({ _id: testUserId });
  await mongoose.connection.close();
});

describe('POST /api/profile/setup', () => {
  it('rejects requests without an auth token', async () => {
    const res = await request(app).post('/api/profile/setup').send({
      height: 70,
      weightRange: '150-160 lbs',
      fitnessGoal: 'Build Muscle',
      activityLevel: 'moderate',
    });

    expect(res.statusCode).toBe(401);
  });

  it('rejects incomplete profile data', async () => {
    const res = await request(app)
      .post('/api/profile/setup')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ height: 70 }); // missing required fields

    expect(res.statusCode).toBe(400);
  });

  it('saves a complete profile with a valid token', async () => {
    const res = await request(app)
      .post('/api/profile/setup')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        height: 70,
        weightRange: '150-160 lbs',
        fitnessGoal: 'Build Muscle',
        activityLevel: 'moderate',
        weightliftingFrequency: 4,
        cardioType: 'running',
        cardioFrequency: 2,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.profileComplete).toBe(true);
  });
});

describe('GET /api/profile', () => {
  it('rejects requests without an auth token', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.statusCode).toBe(401);
  });

  it('returns the profile with a valid token', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testEmail);
  });
});

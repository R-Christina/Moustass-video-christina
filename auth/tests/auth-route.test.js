// tests/auth-route.test.js
jest.mock('../src/service/auth-service');

jest.mock('../src/config/passport', () => ({
  authenticate: jest.fn(() => (req, res, next) => next()),
}));

jest.mock('../src/middleware/auth-middleware', () => ({
  requireAuth: (req, res, next) => next(),
}));

const request = require('supertest');
const express = require('express');
const authRouter = require('../src/route/auth-route');
const authService = require('../src/service/auth-service');

describe('Auth Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Middleware pour mocker req.user
    app.use((req, res, next) => {
      req.user = { sub: '123', username: 'testuser', email: 'test@test.com' };
      next();
    });

    app.use('/auth', authRouter);
  });

  it('GET /auth/profile devrait renvoyer le user normalisé', async () => {
    authService.normalizeUserProfile.mockReturnValue({
      sub: '123',
      username: 'testuser',
      email: 'test@test.com'
    });

    const res = await request(app).get('/auth/profile');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: 'Vous êtes connecté !',
      user: {
        sub: '123',
        username: 'testuser',
        email: 'test@test.com'
      }
    });
  });
});

// tests/server.test.js
jest.mock('../auth-db', () => ({
  initDb: jest.fn().mockResolvedValue(true),
  logAudit: jest.fn().mockResolvedValue(true),
}));

jest.mock('passport', () => ({
  authenticate: () => (req, res, next) => next(),
  initialize: () => (req, res, next) => next(),
  session: () => (req, res, next) => next(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

const request = require('supertest');
const app = require('../server');

describe('Auth Service simple test', () => {
  it('GET /profile renvoie 401 si non connecté', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Non authentifié' });
  });
});

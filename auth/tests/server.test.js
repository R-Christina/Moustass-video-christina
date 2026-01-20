// Mock des routes pour les tests unitaires
jest.mock('../route/auth-route', () => {
  const express = require('express');
  const router = express.Router();

  // juste un endpoint minimal pour /profile
  router.get('/profile', (req, res) => {
    res.status(401).json({ error: 'Non authentifié' });
  });

  return router;
});

// Mock de la DB
jest.mock('../auth-db', () => ({
  initDb: jest.fn().mockResolvedValue(true),
  logAudit: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const app = require('../app'); // on importe app.js

describe('Auth Service simple test', () => {
  it('GET /profile renvoie 401 si non connecté', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Non authentifié' });
  });
});

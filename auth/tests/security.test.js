const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { configureSecurity } = require('../src/config/security');

jest.mock('cors');
jest.mock('express-rate-limit');

describe('configureSecurity', () => {
  let app;

  beforeEach(() => {
    app = { use: jest.fn() };
    cors.mockImplementation(() => 'cors-middleware');
    rateLimit.mockImplementation(() => 'rate-limit-middleware');
  });

  it('should apply CORS and rate limiting middleware', () => {
    configureSecurity(app);

    // Vérifie que cors a été appelé avec les bonnes options
    expect(cors).toHaveBeenCalledWith({
      origin: 'http://localhost:8081',
      credentials: true
    });

    // Vérifie que rateLimit a été appelé avec les bonnes options
    expect(rateLimit).toHaveBeenCalledWith(expect.objectContaining({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Trop de requêtes, veuillez réessayer plus tard.'
    }));

    // Vérifie que les middlewares sont ajoutés à l'app
    expect(app.use).toHaveBeenCalledWith('cors-middleware');
    expect(app.use).toHaveBeenCalledWith('rate-limit-middleware');
  });

  it('should allow custom options', () => {
    configureSecurity(app, { origin: 'http://example.com', maxRequests: 50 });

    expect(cors).toHaveBeenCalledWith({
      origin: 'http://example.com',
      credentials: true
    });

    expect(rateLimit).toHaveBeenCalledWith(expect.objectContaining({
      max: 50
    }));
  });
});

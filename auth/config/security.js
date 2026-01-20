const cors = require('cors');
const rateLimit = require('express-rate-limit');

function configureSecurity(app, options = {}) {
  const origin = options.origin || 'http://localhost:8081';
  const maxRequests = options.maxRequests || 100;

  // CORS
  app.use(cors({
    origin,
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  });

  app.use(limiter);
}

module.exports = { configureSecurity };
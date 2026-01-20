const authService = require('../service/auth-service');

function requireAuth(req, res, next, isAuthFn = authService.isAuthenticated) {
  if (!isAuthFn(req)) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  next();
}

module.exports = { requireAuth };
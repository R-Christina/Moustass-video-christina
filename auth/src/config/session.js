const session = require('express-session');

function configureSession(app, options = {}) {
  const secret = options.secret || process.env.SESSION_SECRET || 'super-secret-change-in-prod';
  const maxAge = options.maxAge || 3600000; // 1h

  app.use(session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge
    }
  }));
}

module.exports = { configureSession };
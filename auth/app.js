const express = require('express');
const { configureSecurity } = require('./config/security');
const { configureSession } = require('./config/session');
const { configurePassport } = require('./config/passport');
const authRoutes = require('./route/auth-route');

const app = express();

// Middlewares
configureSecurity(app);
configureSession(app);
configurePassport(app);

// Routes
app.use('/', authRoutes);

module.exports = app;
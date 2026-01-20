const express = require('express');
const session = require('express-session');
const passport = require('./config/passport'); // <- l’instance maintenant
const authRoutes = require('./route/auth-route');

const app = express();
app.disable('x-powered-by');

// Sessions
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', authRoutes);

module.exports = app;

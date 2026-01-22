const express = require("express");
const session = require("express-session");
const cors = require("cors");

const userRoutes = require("./routes/users");
const healthRoutes = require("./routes/health");

const app = express();
app.disable("x-powered-by");

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

app.use(express.json());

// ⚠️ session compatible auth-service
app.use(
  session({
    secret: "secret", // ⚠️ même secret que auth
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/users", userRoutes);
app.use("/health", healthRoutes);

module.exports = app;

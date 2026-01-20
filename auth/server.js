const express = require("express");
const { initDb } = require("./auth-db");
const authRoutes = require("./route/auth-route");
const { configureSecurity } = require("./config/security");
const { configureSession } = require("./config/session");
const { configurePassport } = require("./config/passport");

const app = express();
const PORT = 3000;

// Configuration
configureSecurity(app);   // CORS, rate limiting
configureSession(app);    // sessions
configurePassport(app);   // auth

// Routes
app.use("/", authRoutes);

// Démarrage serveur après init DB
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => console.log(`Auth Service lancé sur http://localhost:${PORT}`));
  } catch (err) {
    console.error("Erreur DB:", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;

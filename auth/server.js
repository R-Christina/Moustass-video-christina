const app = require('./src/app');
const { initDb } = require('./src/auth-db');
const PORT = 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Auth Service lancé sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Erreur DB:", err);
    process.exit(1);
  });
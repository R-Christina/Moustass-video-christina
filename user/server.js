const app = require("./src/app");
const { initDatabase } = require("./src/user-db");

const PORT = 4000;

initDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`👤 User Service lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur DB user-service:", err);
    process.exit(1);
  });

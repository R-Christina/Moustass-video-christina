const mysql = require("mysql2/promise");
const config = require("./config/index");

const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDb() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS audits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      actor VARCHAR(255),
      action VARCHAR(255),
      target VARCHAR(255),
      time DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip VARCHAR(45),
      signature TEXT
    );
  `);
}

async function logAudit(data) {
  const { actor, action, target, ip, signature = "login-dummy-sig" } = data;
  await pool.execute(
    "INSERT INTO audits (actor, action, target, ip, signature) VALUES (?, ?, ?, ?, ?)",
    [actor, action, target, ip, signature]
  );
}


module.exports = { initDb, logAudit, pool };

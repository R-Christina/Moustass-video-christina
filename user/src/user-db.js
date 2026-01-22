const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDatabase() {
  const conn = await pool.getConnection();
  try {
    // users
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255),
        role ENUM('user','admin_security') DEFAULT 'user'
      );
    `);

    // user_keys
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS user_keys (
        key_id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        type VARCHAR(50),
        size INT,
        public_pem TEXT,
        statut VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);

    console.log("✅ User tables ready");
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDatabase };

const crypto = require("crypto");
const { pool } = require("../user-db");
const vault = require("node-vault")({
  apiVersion: "v1",
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});

function generateRSAKeyPair() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 3072,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
}

async function createUserIfNotExists({ user_id, username, email}) {
  await pool.execute(
    `INSERT IGNORE INTO users (user_id, username, email)
     VALUES (?, ?, ?)`,
    [user_id, username, email || null]
  );
}

async function createUserKeyIfNotExists(user_id) {
  const [rows] = await pool.execute(
    "SELECT key_id FROM user_keys WHERE user_id = ? AND statut = 'active'",
    [user_id]
  );

  if (rows.length) return;

  const { publicKey, privateKey } = generateRSAKeyPair();
  const keyId = crypto.randomUUID();

  await vault.write(`secret/data/keys/${user_id}`, {
    data: { private_key_pem: privateKey },
  });

  await pool.execute(
    `INSERT INTO user_keys (key_id, user_id, type, size, public_pem, statut)
     VALUES (?, ?, 'RSA-PSS', 3072, ?, 'active')`,
    [keyId, user_id, publicKey]
  );

  console.log(`✅ Clé publique générée pour ${user_id}`);
}

async function getPublicKey(userId) {
  const [rows] = await pool.execute(
    "SELECT public_pem FROM user_keys WHERE user_id = ? AND statut = 'active'",
    [userId]
  );
  if (!rows.length) throw new Error("Clé non trouvée");
  return rows[0].public_pem;
}

module.exports = {
  createUserIfNotExists,
  createUserKeyIfNotExists,
  getPublicKey,
};

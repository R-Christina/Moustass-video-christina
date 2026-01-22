const crypto = require("crypto");
const userService = require("../user-service");
const vault = require("node-vault");

// Mocks
jest.mock("../user-db", () => ({
  pool: {
    execute: jest.fn(),
  },
}));

jest.mock("node-vault", () => {
  return jest.fn().mockImplementation(() => ({
    write: jest.fn().mockResolvedValue({}),
  }));
});

const { pool } = require("../user-db");

describe("User Service", () => {
  const testUser = { user_id: "u123", username: "testuser", email: "t@t.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("doit créer un utilisateur et une clé si inexistant", async () => {
    // Simuler pas de clé active en DB
    pool.execute.mockResolvedValueOnce([[]]); // pour SELECT key_id

    // createUserIfNotExists
    pool.execute.mockResolvedValueOnce(); // pour INSERT IGNORE users
    // createUserKeyIfNotExists
    pool.execute.mockResolvedValueOnce(); // pour INSERT user_keys

    // Appel de la fonction
    await userService.createUserIfNotExists(testUser);
    await userService.createUserKeyIfNotExists(testUser.user_id);

    // Vérifications
    expect(pool.execute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT IGNORE INTO users"),
      [testUser.user_id, testUser.username, testUser.email]
    );

    expect(pool.execute).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO user_keys"),
      expect.any(Array)
    );

    // Vault.write appelé
    const vaultInstance = vault.mock.results[0].value;
    expect(vaultInstance.write).toHaveBeenCalledWith(
      `secret/data/keys/${testUser.user_id}`,
      expect.objectContaining({
        data: expect.objectContaining({ private_key_pem: expect.any(String) }),
      })
    );
  });

  it("doit récupérer la clé publique si existante", async () => {
    const fakePublicKey = "FAKE_PUBLIC_KEY";
    pool.execute.mockResolvedValueOnce([[{ public_pem: fakePublicKey }]]);

    const pubKey = await userService.getPublicKey(testUser.user_id);
    expect(pubKey).toBe(fakePublicKey);
  });

  it("doit échouer si la clé publique n'existe pas", async () => {
    pool.execute.mockResolvedValueOnce([[]]);
    await expect(userService.getPublicKey(testUser.user_id)).rejects.toThrow(
      "Clé non trouvée"
    );
  });
});

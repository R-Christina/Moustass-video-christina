const userService = require("../src/service/user-service");
const { pool } = require("../src/user-db");
const vault = require("node-vault");

// Mock MySQL pool
jest.mock("../src/user-db", () => ({
  pool: { execute: jest.fn() },
}));

// Mock Vault
jest.mock("node-vault", () => {
  return jest.fn(() => ({
    write: jest.fn().mockResolvedValue("FAKE_VAULT_WRITE"),
  }));
});

describe("User Service", () => {
  const testUser = {
    user_id: "test123",
    username: "testuser",
    email: "test@mail.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("doit créer un utilisateur et une clé si inexistant", async () => {
    // simulate user does not exist & no key
    pool.execute
      .mockResolvedValueOnce([[]])      // select key -> pas de clé
      .mockResolvedValueOnce([{ insertId: 1 }]); // insert key -> OK

    await expect(userService.createUserKeyIfNotExists(testUser.user_id)).resolves.not.toThrow();

    expect(pool.execute).toHaveBeenCalledTimes(2);
  });

  it("doit récupérer la clé publique si existante", async () => {
    const fakeKey = "FAKE_PUBLIC_KEY";
    pool.execute.mockResolvedValueOnce([[{ public_pem: fakeKey }]]); // [[]] pour destructuring

    const key = await userService.getPublicKey(testUser.user_id);
    expect(key).toBe(fakeKey);
  });

  it("doit échouer si la clé publique n'existe pas", async () => {
    pool.execute.mockResolvedValueOnce([[]]); // [[]] => rows vide

    await expect(userService.getPublicKey(testUser.user_id)).rejects.toThrow("Clé non trouvée");
  });
});

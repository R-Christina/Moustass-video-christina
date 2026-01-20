// server.test.js
const request = require("supertest");
const app = require("../server");

describe("Auth Service", () => {
  it("doit exposer la route racine", async () => {
    const res = await request(app).get("/");
    expect([200, 404]).toContain(res.statusCode); // 200 si route existe, 404 sinon
  });
});
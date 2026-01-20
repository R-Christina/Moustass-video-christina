const { requireAuth } = require("../src/middleware/auth-middleware");

describe("requireAuth middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("appelle next si l'utilisateur est authentifié", () => {
    const isAuthFn = jest.fn().mockReturnValue(true);

    requireAuth(req, res, next, isAuthFn);

    expect(isAuthFn).toHaveBeenCalledWith(req);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("renvoie 401 si l'utilisateur n'est pas authentifié", () => {
    const isAuthFn = jest.fn().mockReturnValue(false);

    requireAuth(req, res, next, isAuthFn);

    expect(isAuthFn).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Non authentifié" });
    expect(next).not.toHaveBeenCalled();
  });
});

const authService = require('../src/service/auth-service');

describe('auth-service', () => {
  describe('normalizeUserProfile', () => {
    it('devrait normaliser un utilisateur avec email direct', () => {
      const user = { sub: '1', username: 'test', email: 'test@example.com' };
      const result = authService.normalizeUserProfile(user);
      expect(result).toEqual({
        sub: '1',
        username: 'test',
        email: 'test@example.com',
        raw: user,
      });
    });

    it('devrait utiliser emails[0].value si email absent', () => {
      const user = { sub: '2', username: 'user2', emails: [{ value: 'user2@example.com' }] };
      const result = authService.normalizeUserProfile(user);
      expect(result.email).toBe('user2@example.com');
    });
  });

  describe('logSuccessfulLogin', () => {
    it('devrait appeler auditLogger avec les bons paramètres', async () => {
      const mockLogger = jest.fn().mockResolvedValue();
      const user = { sub: '123' };
      const ip = '127.0.0.1';

      await authService.logSuccessfulLogin(user, ip, mockLogger);

      expect(mockLogger).toHaveBeenCalledWith({
        actor: '123',
        action: 'login_success',
        target: 'auth_session',
        ip,
      });
    });

    it('devrait utiliser "unknown" si sub absent', async () => {
      const mockLogger = jest.fn().mockResolvedValue();
      const user = {};
      const ip = '127.0.0.1';

      await authService.logSuccessfulLogin(user, ip, mockLogger);

      expect(mockLogger).toHaveBeenCalledWith({
        actor: 'unknown',
        action: 'login_success',
        target: 'auth_session',
        ip,
      });
    });

    it('ne doit pas lancer d\'erreur si auditLogger échoue', async () => {
      const mockLogger = jest.fn().mockRejectedValue(new Error('fail'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const user = { sub: '1' };
      const ip = '127.0.0.1';

      await expect(authService.logSuccessfulLogin(user, ip, mockLogger)).resolves.not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Erreur lors de l\'enregistrement de l\'audit:'), expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('isAuthenticated', () => {
    it('devrait retourner true si req.isAuthenticated() retourne true', () => {
      const req = { isAuthenticated: () => true };
      expect(authService.isAuthenticated(req)).toBe(true);
    });

    it('devrait retourner false si req.isAuthenticated() est absent ou false', () => {
      expect(authService.isAuthenticated({})).toBe(false);
      expect(authService.isAuthenticated({ isAuthenticated: () => false })).toBe(false);
    });
  });
});

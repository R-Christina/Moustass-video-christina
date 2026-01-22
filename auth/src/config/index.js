module.exports = {
  CLIENT_ID: process.env.CLIENT_ID || 'moustass-client',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'your-client-secret',
  REDIRECT_URI: process.env.REDIRECT_URI || 'http://localhost:3000/callback',
  
  // Keycloak URLs
  KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/moustass',
  KEYCLOAK_AUTH_URL: process.env.KEYCLOAK_AUTH_URL || 'http://localhost:8080/realms/moustass/protocol/openid-connect/auth',
  KEYCLOAK_TOKEN_URL: process.env.KEYCLOAK_TOKEN_URL || 'http://keycloak:8080/realms/moustass/protocol/openid-connect/token',
  KEYCLOAK_USERINFO_URL: process.env.KEYCLOAK_USERINFO_URL || 'http://keycloak:8080/realms/moustass/protocol/openid-connect/userinfo',
  
  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || 'super-secret-change-in-prod',
  
  // Database
  DB_HOST: process.env.DB_HOST || 'mysql',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'root',
  DB_NAME: process.env.DB_NAME || 'moustass_db'
};
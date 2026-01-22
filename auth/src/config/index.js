module.exports = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
  
  // Keycloak URLs
  KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
  KEYCLOAK_AUTH_URL: process.env.KEYCLOAK_AUTH_URL,
  KEYCLOAK_TOKEN_URL: process.env.KEYCLOAK_TOKEN_URL,
  KEYCLOAK_USERINFO_URL: process.env.KEYCLOAK_USERINFO_URL,
  
  // Session
  SESSION_SECRET: process.env.SESSION_SECRET,
  
  // Database
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER ,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME
};
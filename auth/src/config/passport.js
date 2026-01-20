const passport = require('passport');
const { Strategy: OpenIdConnectStrategy } = require('passport-openidconnect');
const config = require('./index');

/**
 * Configure Passport avec OIDC pour Keycloak
 */
function configurePassport(app) {
  passport.use(
    new OpenIdConnectStrategy(
      {
        issuer: config.KEYCLOAK_ISSUER,
        authorizationURL: config.KEYCLOAK_AUTH_URL,
        tokenURL: config.KEYCLOAK_TOKEN_URL,
        userInfoURL: config.KEYCLOAK_USERINFO_URL,
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: config.REDIRECT_URI,
        scope: ['openid', 'profile', 'email'],
      },
      (issuer, profile, cb) => cb(null, profile)
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = { configurePassport };

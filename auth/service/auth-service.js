const { logAudit } = require("../auth-db");

function normalizeUserProfile(user) {
  return {
    sub: user.sub,
    username: user.username,
    email: user.email || user.emails?.[0]?.value,
    raw: user,
  };
}

async function logSuccessfulLogin(user, ip, auditLogger = logAudit) {
  try {
    const actor = user.sub || "unknown";
    await auditLogger({ actor, action: "login_success", target: "auth_session", ip });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement de l'audit:", err);
  }
}

function isAuthenticated(req) {
  return req.isAuthenticated?.() || false;
}

module.exports = { normalizeUserProfile, logSuccessfulLogin, isAuthenticated };
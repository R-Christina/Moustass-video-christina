const express = require("express");
const passport = require("../config/passport");
const router = express.Router();
const authService = require("../service/auth-service");
const { requireAuth } = require("../middleware/auth-middleware");

const DASHBOARD_URL =
  process.env.FRONT_URL || "http://localhost:8081/dashboard.html";
const METADATA_URL =
  process.env.USER_URL || "http://user:4000/users/sync";

router.get(
  "/login",
  passport.authenticate("openidconnect", { prompt: "login" }),
);

router.get(
  "/callback",
  passport.authenticate("openidconnect", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const user = authService.normalizeUserProfile(req.user);

      await fetch(METADATA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.sub,
          username: user.username,
          email: user.email,
        }),
      });

      await authService.logSuccessfulLogin(user, req.ip);
      res.redirect(DASHBOARD_URL);
    } catch (err) {
      console.error("Erreur lors du sync utilisateur:", err);
      res.redirect("/login");
    }
  },
);

router.get("/profile", requireAuth, (req, res) => {
  const user = authService.normalizeUserProfile(req.user);
  res.json({ message: "Vous êtes connecté !", user });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid", { path: "/" });
      res.redirect(process.env.FRONTEND_URL || "http://localhost:8081");
    });
  });
});

module.exports = router;

const express = require("express");
const userService = require("../service/user-service");

const router = express.Router();

router.post("/sync", async (req, res) => {
  try {
    const { user_id, username, email} = req.body;

    if (!user_id || !username)
      return res.status(400).json({ error: "user_id et username requis" });

    await userService.createUserIfNotExists({ user_id, username, email});
    await userService.createUserKeyIfNotExists(user_id);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Erreur sync user:", err);
    res.status(500).json({ error: "Sync user failed" });
  }
});

router.get("/:userId/public-key", async (req, res) => {
  try {
    const publicKey = await userService.getPublicKey(req.params.userId);
    res.json({ publicKey });
  } catch (err) {
    console.error("❌ Erreur récupération clé:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

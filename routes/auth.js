const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);

// router.put("/change-password", authMiddleware, authController.changePassword);
// router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;

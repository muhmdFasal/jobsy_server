
// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const authMiddleware = require("../middleware/AuthMiddleware");
// const adminMiddleware = require("../middleware/isAdmin");

// // ✅ Get all users (admin only)
// router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // omit passwords
//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Get own profile
// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

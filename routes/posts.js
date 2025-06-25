const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const upload = require("../middleware/Upload");
const fs = require("fs");
const path = require("path");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// @route   POST /api/posts
// @desc    Create a new post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { userId, text } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newPost = new Post({
      user: userId,
      text: text || "",
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const savedPost = await newPost.save();

    // Populate user details for frontend display
    await savedPost.populate("user", "name email avatar");

    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err.message);
    res.status(500).json({ message: "Server error while creating post" });
  }
});

// @route   GET /api/posts
// @desc    Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
});

module.exports = router;

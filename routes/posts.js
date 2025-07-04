const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const {upload}= require("../middleware/Upload");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/AuthMiddleware");


// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// @route POST /api/posts
// @desc  Create a new post
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    const newPost = new Post({
      user: userId,
      text: text || "",
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const savedPost = await newPost.save();
    await savedPost.populate("user", "name image");

    res.status(201).json(savedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err.message);
    res.status(500).json({ message: "Server error while creating post" });
  }
});

// @route GET /api/posts
// @desc  Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
});

// @route GET /api/posts/mine
// @desc  Get posts created by the logged-in user
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find({ user: userId })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error fetching user posts:", err.message);
    res.status(500).json({ message: "Server error while fetching your posts" });
  }
});

// @route PUT /api/posts/:id
// @desc  Edit a post by ID (only by owner)
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { text } = req.body;

    if (text) post.text = text;
    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await post.save();
    await updatedPost.populate("user", "name image");

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("❌ Error updating post:", err.message);
    res.status(500).json({ message: "Server error while updating post" });
  }
});

// @route DELETE /api/posts/:id
// @desc  Delete a post by ID (only by owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "✅ Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err.message);
    res.status(500).json({ message: "Server error while deleting post" });
  }
});

module.exports = router;


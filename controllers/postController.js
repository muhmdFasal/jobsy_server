// Add to your Post schema
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
comments: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }
]

// Like Post
exports.likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post.likes.includes(userId)) post.likes.push(userId);
  await post.save();

  res.json({ msg: "Post liked", likes: post.likes.length });
};

// Add Comment
exports.addComment = async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);
  post.comments.push({ user: req.user.id, text });
  await post.save();

  res.json({ msg: "Comment added", comments: post.comments });
};

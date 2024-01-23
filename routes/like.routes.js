const express = require("express");
const router = express.Router();
const Like = require("../models/Like.model");

// Create a like
router.post("/like", async (req, res, next) => {
  try {
    const { userId, postId } = req.body;
    await Like.create({ user: userId, post: postId });

    // Increment the likes field in the Post document
    await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

// Get all likes for a post
router.get("/post/:postId", async (req, res, next) => {
  try {
    const likes = await Like.find({ post: req.params.postId });
    res.render("like", { likes });
  } catch (error) {
    next(error);
  }
});

// Delete a like
router.delete("/like/:id", async (req, res, next) => {
  try {
    const like = await Like.findById(req.params.id);
    await Like.findByIdAndDelete(req.params.id);

    // Decrement the likes field in the Post document
    await Post.findByIdAndUpdate(like.post, { $inc: { likes: -1 } });

    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

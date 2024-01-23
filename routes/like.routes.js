const express = require("express");
const router = express.Router();
const Like = require("../models/Like.model");

// Create a new like
router.post("/new", async (req, res, next) => {
  const { user, post } = req.body;
  try {
    const like = await Like.create({ user, post });
    res.redirect("/likes");
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
router.delete("/:id", async (req, res, next) => {
  try {
    await Like.findByIdAndDelete(req.params.id);
    res.redirect("/likes");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
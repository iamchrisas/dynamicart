const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");

// Get all comments
router.get("/", async (req, res, next) => {
  try {
    const comments = await Comment.find().populate('user');
    res.render("comment", { comments });
  } catch (error) {
    next(error);
  }
});

// Create a new comment
router.post("/new", async (req, res, next) => {
  const { text, user, post } = req.body;
  try {
    const comment = await Comment.create({ text, user, post });
    res.redirect("/comments");
  } catch (error) {
    next(error);
  }
});

// Get all comments for a post
router.get("/post/:postId", async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('user');
    res.render("comment", { comments });
  } catch (error) {
    next(error);
  }
});

// Update a comment
router.put("/:id", async (req, res, next) => {
  const { text } = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, { text }, { new: true });
    res.redirect("/comments");
  } catch (error) {
    next(error);
  }
});

// Delete a comment
router.delete("/:id", async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect("/comments");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");

// Create a new post
router.post("/new", async (req, res, next) => {
  const { title, description, image, user } = req.body;
  try {
    const post = await Post.create({ title, description, image, user });
    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

// Get all posts
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("posts", { posts });
  } catch (error) {
    next(error);
  }
});

// Get a specific post
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate("hashtags")
      .populate("comments");
    res.render("post-details", { post }); // Render the 'post-details' view
  } catch (error) {
    next(error);
  }
});

// Update a post
router.put("/:id", async (req, res, next) => {
  const { title, description, image } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, image },
      { new: true }
    );
    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

// Delete a post
router.delete("/:id", async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const count = await Post.countDocuments();
    let random = Math.floor(Math.random() * count);
    const post = await Post.findOne().skip(random);
    res.render("post", { post });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

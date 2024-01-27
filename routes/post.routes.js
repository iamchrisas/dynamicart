const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const Tag = require("../models/Tag.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/create", isLoggedIn, async (req, res, next) => {
  try {
    // Pass the user object to the template to indicate login status
    res.render("posts/new-post", { user: req.user });
  } catch (error) {
    next(error);
  }
});

// POST route to create a new post
router.post("/create", isLoggedIn, async (req, res, next) => {
  const { title, image, tags: rawTags } = req.body;

  // Normalize tags: split by commas if it's a string, or use as-is if it's already an array
  const tags =
    typeof rawTags === "string"
      ? rawTags.split(",").map((tag) => tag.trim())
      : Array.isArray(rawTags)
      ? rawTags
      : [];

  try {
    // Find or create tags and get their IDs
    const tagIds = await Promise.all(
      tags.map((tagText) =>
        Tag.findOneAndUpdate(
          { text: tagText },
          { $setOnInsert: { text: tagText } },
          { new: true, upsert: true }
        )
      )
    );

    // Create the post with the resolved tag IDs
    await Post.create({
      title,
      image,
      tags: tagIds.map((tag) => tag._id),
    });

    res.redirect("/posts");
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).render("posts/new-post", { errorMessage: error.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("user");
    // Pass the user object to the template to indicate login status
    res.render("posts/post-details", { post, user: req.user });
  } catch (error) {
    next(error);
  }
});

// POST route to delete a specific post
router.post("/:id/delete", isLoggedIn, async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

// GET route to show the edit form for a specific post
router.get("/:id/edit", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("tags");
    res.render("posts/edit-post", { post });
  } catch (error) {
    next(error);
  }
});

// POST route to update a specific post
router.post("/:id/edit", isLoggedIn, async (req, res, next) => {
  const { title, image, tags: rawTags } = req.body;

  // Normalize tags: split by commas if it's a string, or use as-is if it's already an array
  const tags =
    typeof rawTags === "string"
      ? rawTags.split(",").map((tag) => tag.trim())
      : Array.isArray(rawTags)
      ? rawTags
      : [];

  try {
    // Find or create tags and get their IDs
    const tagIds = await Promise.all(
      tags.map((tagText) =>
        Tag.findOneAndUpdate(
          { text: tagText },
          { $setOnInsert: { text: tagText } },
          { new: true, upsert: true }
        )
      )
    );

    // Update the post with the resolved tag IDs
    await Post.findByIdAndUpdate(req.params.id, {
      title,
      image,
      tags: tagIds.map((tag) => tag._id),
    });

    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).render("posts/edit-post", { errorMessage: error.message });
  }
});

// Show the posts of a specific user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user");
    res.render("user-posts", { posts });
  } catch (error) {
    next(error);
  }
});

// Get all posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("user");
    res.render("posts", { posts });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

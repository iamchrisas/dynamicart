const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const Tag = require("../models/Tag.model");
const isLoggedIn = require("../middleware/isLoggedIn");


// Show the posts of a specific user
// Route to go to prefix - posts - user/id
router.get("/user/:id", async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user");
    res.render("user-posts", { posts });
  } catch (error) {
    next(error);
  }
});



// Delete a post
router.delete("/user/:id", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (String(post.user) !== req.session.currentUser._id) {
      return res.status(401).send("Unauthorized");
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" }); // Send a JSON response
  } catch (error) {
    next(error);
  }
});

// Create a new post
router.post("/new", isLoggedIn, async (req, res, next) => {
  const { title, image, tags } = req.body;
  const user = req.session.currentUser._id; // Get the ID of the currently logged-in user
  try {
    // Create or find tags
    let tagPromises = [];
    if (tags) {
      tagPromises = tags.map(async (tagText) => {
        const tag = await Tag.findOne({ text: tagTex });
        if (tag) {
          return tag;
        } else {
          return Tag.create({ text: tagTex });
        }
      });
    }
    const resolvedTags = await Promise.all(tagPromises);

    const post = await Post.create({
      title,
      image,
      user,
      tags: resolvedTags.map((tag) => tag._id),
    });

    // Add the new post's _id to the posts array of the associated user
    await User.findByIdAndUpdate(user, { $push: { posts: post._id } });

    // Add the new post's _id to the posts array of each associated tag
    await Tag.updateMany(
      { _id: { $in: resolvedTags.map((tag) => tag._id) } },
      { $push: { posts: post._id } }
    );

    res.redirect("/posts");
  } catch (error) {
    next(error);
  }
});

// Get all posts
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("user");
    const postsWithAuthorCheck = posts.map((post) => ({
      ...post.toObject(),
      userIsAuthor:
        post.user && req.session.currentUser
          ? String(post.user._id) === req.session.currentUser._id
          : false,
    }));
    res.render("posts", { posts: postsWithAuthorCheck });
  } catch (error) {
    next(error);
  }
});


module.exports = router;

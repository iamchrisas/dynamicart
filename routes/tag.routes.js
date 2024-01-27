const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag.model");

// Create a new tag
router.post("/new", async (req, res, next) => {
  const { tag } = req.body;
  try {
    const newTag = await Tag.create({ tag });
    res.redirect("/tags");
  } catch (error) {
    next(error);
  }
});

// Get all tags
router.get("/", async (req, res, next) => {
  try {
    const tags = await Tag.find();
    res.render("tags", { tags });
  } catch (error) {
    next(error);
  }
});

// Get a specific tag and the posts associated with it
router.get("/:id", async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id).populate({
      path: "posts",
      populate: {
        path: "user",
        model: "User",
      },
    });

    // Pass the tag text and posts to the template
    res.render("tag-posts", { tag: tag.text, posts: tag.posts });
  } catch (error) {
    next(error);
  }
});

// Update a tag
router.put("/:id", async (req, res, next) => {
  const { tag } = req.body;
  try {
    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.id,
      { tag },
      { new: true }
    );
    res.redirect("/tags");
  } catch (error) {
    next(error);
  }
});

// Delete a tag
router.delete("/:id", async (req, res, next) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.redirect("/tags");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

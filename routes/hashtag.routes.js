const express = require("express");
const router = express.Router();
const Hashtag = require("../models/Hashtag.model");

// Create a new hashtag
router.post("/new", async (req, res, next) => {
  const { tag } = req.body;
  try {
    const hashtag = await Hashtag.create({ tag });
    res.redirect("/hashtags");
  } catch (error) {
    next(error);
  }
});

// Get all hashtags
router.get("/", async (req, res, next) => {
  try {
    const hashtags = await Hashtag.find();
    res.render("hashtag", { hashtags });
  } catch (error) {
    next(error);
  }
});

// Get a specific hashtag
router.get("/:id", async (req, res, next) => {
  try {
    const hashtag = await Hashtag.findById(req.params.id);
    res.render("hashtag", { hashtag });
  } catch (error) {
    next(error);
  }
});

// Update a hashtag
router.put("/:id", async (req, res, next) => {
  const { tag } = req.body;
  try {
    const hashtag = await Hashtag.findByIdAndUpdate(req.params.id, { tag }, { new: true });
    res.redirect("/hashtags");
  } catch (error) {
    next(error);
  }
});

// Delete a hashtag
router.delete("/:id", async (req, res, next) => {
  try {
    await Hashtag.findByIdAndDelete(req.params.id);
    res.redirect("/hashtags");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
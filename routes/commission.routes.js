const express = require("express");
const router = express.Router();
const Commission = require("../models/Commission.model");

// Create a new commission
router.post("/new", async (req, res, next) => {
  const { title, description, price, user } = req.body;
  try {
    const commission = await Commission.create({ title, description, price, user });
    res.redirect("/commissions");
  } catch (error) {
    next(error);
  }
});

// Get all commissions for a user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const commissions = await Commission.find({ user: req.params.userId });
    res.render("commission", { commissions });
  } catch (error) {
    next(error);
  }
});

// Get a specific commission
router.get("/:id", async (req, res, next) => {
  try {
    const commission = await Commission.findById(req.params.id);
    res.render("commission", { commission });
  } catch (error) {
    next(error);
  }
});

// Update a commission
router.put("/:id", async (req, res, next) => {
  const { title, description, price } = req.body;
  try {
    const commission = await Commission.findByIdAndUpdate(req.params.id, { title, description, price }, { new: true });
    res.redirect("/commissions");
  } catch (error) {
    next(error);
  }
});

// Delete a commission
router.delete("/:id", async (req, res, next) => {
  try {
    await Commission.findByIdAndDelete(req.params.id);
    res.redirect("/commissions");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
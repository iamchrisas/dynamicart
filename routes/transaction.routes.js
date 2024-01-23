const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction.model");

// Create a new transaction
router.post("/new", async (req, res, next) => {
  const { amount, user, commission } = req.body;
  try {
    const transaction = await Transaction.create({ amount, user, commission });
    res.redirect("/transactions");
  } catch (error) {
    next(error);
  }
});

// Get all transactions for a user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId });
    res.render("transaction", { transactions });
  } catch (error) {
    next(error);
  }
});

// Get a specific transaction
router.get("/:id", async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.render("transaction", { transaction });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

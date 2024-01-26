const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }

  // Create a new user - start by hashing the password
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a user and save it in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // After creating the user, check if they uploaded an artwork
    if (req.body.artwork) {
      await User.findByIdAndUpdate(user._id, { role: "artist" });
    } res.redirect("/auth/login");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Username and email need to be unique. Provide a valid username or email.",
      });
    } else {
      next(error);
    }
  }
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});


// POST /auth/login
router.post("/login", isLoggedOut, async (req, res, next) => {
  const { email, password } = req.body;

  // Check that email and password are provided
  if (email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage: "Please provide both email and password.",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).render("auth/login", { errorMessage: "Wrong credentials." });
      return;
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (!isSamePassword) {
      res.status(400).render("auth/login", { errorMessage: "Wrong credentials." });
      return;
    }

    // Convert the user document to an object and remove the password
    const userObject = user.toObject();
    delete userObject.password;

    // Add the user object to the session
    req.session.currentUser = userObject;

    res.redirect("/");
  } catch (err) {
    next(err);
  }
});


// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

module.exports = router;

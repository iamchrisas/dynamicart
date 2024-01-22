const express = require("express");
const router = express.Router();

const Content = require("../models/Content.model");

// GET home page
router.get("/contents", (req, res, next) => {
  Content.find()
    .then(allContents => {
      res.render("contents/list", { contents: allContents });
    })
    .catch(err => console.log(err));
});

module.exports = router;
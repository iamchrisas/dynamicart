// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "dynamicart";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// Import the routes

const commentRoutes = require("./routes/comment.routes");
const hashtagRoutes = require("./routes/hashtag.routes");
const likeRoutes = require("./routes/like.routes");
const postRoutes = require("./routes/post.routes");

// Use the routes
app.use("/comments", commentRoutes);
app.use("/hashtags", hashtagRoutes);
app.use("/likes", likeRoutes);
app.use("/posts", postRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

/*Change the link of the post to smth i already have
app.js
users /id

route without typo
404 = the route doesn 
http://localhost:3000/user/65b02d8f47f0ba67fa7f1bb9

/posts/user/id

*/
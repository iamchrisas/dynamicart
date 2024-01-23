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
const commissionRoutes = require("./routes/commission.routes");
const hashtagRoutes = require("./routes/hashtag.routes");
const likeRoutes = require("./routes/like.routes");
const postRoutes = require("./routes/post.routes");
const transactionRoutes = require("./routes/transaction.routes");

// Use the routes
app.use("/comments", commentRoutes);
app.use("/commissions", commissionRoutes);
app.use("/hashtags", hashtagRoutes);
app.use("/likes", likeRoutes);
app.use("/posts", postRoutes);
app.use("/transactions", transactionRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

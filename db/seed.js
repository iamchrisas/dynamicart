const mongoose = require("mongoose");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const Commission = require("../models/Commission.model");
const Hashtag = require("../models/Hashtag.model");
const Like = require("../models/Like.model");
const Post = require("../models/Post.model");
const Transaction = require("../models/Transaction.model");

const dbURI = "mongodb://127.0.0.1:27017/dynamicart";

// Sample data
const users = [
  {
    username: "user1",
    email: "user1@example.com",
    password: "password1",
    role: "user",
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "password2",
    role: "user",
  },
  {
    username: "user3",
    email: "user3@example.com",
    password: "password3",
    role: "user",
  },
  {
    username: "user4",
    email: "user4@example.com",
    password: "password4",
    role: "user",
  },
  {
    username: "user5",
    email: "user5@example.com",
    password: "password5",
    role: "user",
  },
  {
    username: "user6",
    email: "user6@example.com",
    password: "password6",
    role: "user",
  },
];

let userIds;
let postIds;

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to the database");

    return User.create(users);
  })
  .then((createdUsers) => {
    console.log("Users created");
    userIds = createdUsers.map((user) => user._id);

    const posts = [
      { title: "Post1", user: userIds[0], content: "Content1" },
      { title: "Post2", user: userIds[1], content: "Content2" },
      { title: "Post3", user: userIds[2], content: "Content3" },
      { title: "Post4", user: userIds[3], content: "Content4" },
      { title: "Post5", user: userIds[4], content: "Content5" },
      { title: "Post6", user: userIds[5], content: "Content6" },
    ];

    return Post.create(posts);
  })
  .then((createdPosts) => {
    console.log("Posts created");
    postIds = createdPosts.map((post) => post._id);

    const comments = [
      { text: "This is a comment", user: userIds[0], post: postIds[0] },
      { text: "This is another comment", user: userIds[1], post: postIds[1] },
      { text: "Yet another comment", user: userIds[2], post: postIds[2] },
      { text: "More comments", user: userIds[3], post: postIds[3] },
      { text: "Keep the comments coming", user: userIds[4], post: postIds[4] },
      { text: "Last comment", user: userIds[5], post: postIds[5] },
    ];

    return Comment.create(comments);
  })
  .then((createdComments) => {
    console.log("Comments created");

    const commissions = [
      { title: "Commission1", user: userIds[0], details: "Details1" },
      { title: "Commission2", user: userIds[1], details: "Details2" },
      { title: "Commission3", user: userIds[2], details: "Details3" },
      { title: "Commission4", user: userIds[3], details: "Details4" },
      { title: "Commission5", user: userIds[4], details: "Details5" },
      { title: "Commission6", user: userIds[5], details: "Details6" },
    ];

    return Commission.create(commissions);
  })
  .then((createdCommissions) => {
    console.log("Commissions created");
    const commissionIds = createdCommissions.map(
      (commission) => commission._id
    );

    const transactions = [
      { user: userIds[0], commission: commissionIds[0], amount: 100 },
      { user: userIds[1], commission: commissionIds[1], amount: 200 },
      { user: userIds[2], commission: commissionIds[2], amount: 300 },
      { user: userIds[3], commission: commissionIds[3], amount: 400 },
      { user: userIds[4], commission: commissionIds[4], amount: 500 },
      { user: userIds[5], commission: commissionIds[5], amount: 600 },
    ];

    return Transaction.create(transactions);
  })
  .then((createdTransactions) => {
    console.log("Transactions created");

    const hashtags = [
      { text: "Hashtag1", posts: [postIds[0]] },
      { text: "Hashtag2", posts: [postIds[1]] },
      { text: "Hashtag3", posts: [postIds[2]] },
      { text: "Hashtag4", posts: [postIds[3]] },
      { text: "Hashtag5", posts: [postIds[4]] },
      { text: "Hashtag6", posts: [postIds[5]] },
    ];

    return Hashtag.create(hashtags);
  })
  .then((createdHashtags) => {
    console.log("Hashtags created");

    const likes = [
      { user: userIds[0], post: postIds[0] },
      { user: userIds[1], post: postIds[1] },
      { user: userIds[2], post: postIds[2] },
      { user: userIds[3], post: postIds[3] },
      { user: userIds[4], post: postIds[4] },
      { user: userIds[5], post: postIds[5] },
    ];

    return Like.create(likes);
  })
  .then(() => console.log("Likes created"))
  .catch((error) => console.error(error))
  .finally(() => mongoose.connection.close());

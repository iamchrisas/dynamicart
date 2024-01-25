const mongoose = require("mongoose");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const Hashtag = require("../models/Hashtag.model");
const Like = require("../models/Like.model");
const Post = require("../models/Post.model");

const dbURI = "mongodb://127.0.0.1:27017/dynamicart";

// Sample data
const users = [
  {
    username: "Vangogh",
    email: "v@gmail.com",
    password: "password",
    role: "user",
  },
  {
    username: "Davinci",
    email: "d@gmail.com",
    password: "password",
    role: "user",
  },
  {
    username: "Kandinsky",
    email: "k@gmail.com",
    password: "password",
    role: "user",
  },
];

const createUsers = async (users) => {
  const userPromises = users.map((user) => User.create(user));
  return Promise.all(userPromises);
};

const createPosts = async (users) => {
  const postPromises = users.map((user, index) => Post.create({
    title: `Post${index + 1}`,
    user: user._id,
    likes: 12,
    image: `https://flif.info/example-images/fish.png`,
  }));
  return Promise.all(postPromises);
};

const createCommentsLikesHashtags = async (users, posts) => {
  const commentPromises = users.map((user, index) => Comment.create({
    text: `This is a comment ${index + 1}`,
    user: user._id,
    post: posts[index]._id,
  }));

  const likePromises = users.map((user, index) => Like.create({ user: user._id, post: posts[index]._id }));

  const hashtagPromises = users.map((user, index) => Hashtag.create({
    text: `Hashtag${index + 1}`,
    posts: [posts[index]._id],
  }));

  return Promise.all([...commentPromises, ...likePromises, ...hashtagPromises]);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to the database");

    const createdUsers = await createUsers(users);
    const createdPosts = await createPosts(createdUsers);
    await createCommentsLikesHashtags(createdUsers, createdPosts);

    console.log("All data created");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
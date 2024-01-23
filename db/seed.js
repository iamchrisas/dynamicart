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
    username: "Vangogh",
    email: "v@gmail.com",
    password: "testok",
    role: "user",
  },
  {
    username: "Davinci",
    email: "d@gmail.com",
    password: "testok",
    role: "user",
  },
  {
    username: "Kandinsky",
    email: "k@gmail.com",
    password: "testok",
    role: "user",
  },
];

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to the database");

    const userPromises = users.map((user) => User.create(user));

    return Promise.all(userPromises);
  })
  .then((createdUsers) => {
    const postPromises = createdUsers.map((user, index) => {
      return Post.create({
        title: `Post${index + 1}`,
        user: user._id,
        likes: 12,
        image: `https://flif.info/example-images/fish.png`,
      });
    });

    return Promise.all(postPromises).then((createdPosts) => {
      const commentPromises = createdUsers.map((user, index) => {
        return Comment.create({
          text: `This is a comment ${index + 1}`,
          user: user._id,
          post: createdPosts[index]._id,
        });
      });

      const likePromises = createdUsers.map((user, index) => {
        return Like.create({ user: user._id, post: createdPosts[index]._id });
      });

      const hashtagPromises = createdUsers.map((user, index) => {
        return Hashtag.create({
          text: `Hashtag${index + 1}`,
          posts: [createdPosts[index]._id],
        });
      });

      return Promise.all([
        ...commentPromises,
        ...likePromises,
        ...hashtagPromises,
      ]).then(() => {
        const commissionPromises = createdUsers.map((user, index) => {
          return Commission.create({
            title: `Commission${index + 1}`,
            user: user._id,
          });
        });

        return Promise.all(commissionPromises).then((createdCommissions) => {
          const transactionPromises = createdUsers.map((user, index) => {
            return Transaction.create({
              user: user._id,
              commission: createdCommissions[index]._id,
              amount: (index + 1) * 100,
            });
          });

          return Promise.all(transactionPromises);
        });
      });
    });
  })
  .then(() => console.log("All data created"))
  .catch((error) => console.error(error))
  .finally(() => mongoose.connection.close());

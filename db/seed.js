const mongoose = require("mongoose");
const User = require("../models/User.model");
const Tag = require("../models/Tag.model");
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

const images = [
  'https://pics.craiyon.com/2023-11-06/a3f831f9c8194ff2b9335245e20f30a2.webp',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfRwv2CTBx8gTsNrIDstakk_Z1ZcH1EYlC7jhl_k5dUpqn1ODnkwzwtpuTpRPFHGTsrU4&usqp=CAU',
  'https://pics.craiyon.com/2023-10-05/08ff3bea1eb541e7a1129cc7878a89fc.webp',
  'https://pics.craiyon.com/2023-11-21/qZ-HtyjrRMmG9qiiRtZmMQ.webp',
  'https://pics.craiyon.com/2023-09-10/4540c721a481476283c6427480683f16.webp',
  'https://pics.craiyon.com/2023-09-25/fe754bef5bc54c258ad6ecd90393e1b3.webp'
];

const getRandomImage = () => {
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const createPosts = async (users) => {
  const postPromises = users.flatMap((user, index) => {
    // Create 3 posts for each user
    return Array.from({ length: 3 }, async (_, i) => {
      return Post.create({
        title: `Post${index * 3 + i + 1}`,
        user: user._id,
        image: getRandomImage(),
      });
    });
  });

  return Promise.all(postPromises);
};

const createTags = async (posts) => {
  const tagPromises = posts.map((post, index) =>
    // Create a tag for each post
    Tag.create({
      text: `Tag${index + 1}`,
      posts: [post._id],
    })
  );

  return Promise.all(tagPromises);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to the database");

    const createdUsers = await createUsers(users);
    const createdPosts = await createPosts(createdUsers);
    await createTags(createdPosts);

    console.log("All data created");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
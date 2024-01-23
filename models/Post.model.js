const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    hashtags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Hashtag'
      }
    ],
    likes: Number,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    availableForSale: Boolean,
    price: Number
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
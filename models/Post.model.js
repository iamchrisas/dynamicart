const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
const { Schema, model } = require("mongoose");

const hashtagSchema = new Schema(
  {
    text: String,
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Hashtag", hashtagSchema);
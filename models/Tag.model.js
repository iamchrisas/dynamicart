const { Schema, model } = require("mongoose");

const tagSchema = new Schema(
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

module.exports = model("Tag", tagSchema);
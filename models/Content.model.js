const { Schema, model } = require("mongoose");

const contentSchema = new Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Content", contentSchema);

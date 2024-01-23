const { Schema, model } = require("mongoose");

const commissionSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Commission", commissionSchema);
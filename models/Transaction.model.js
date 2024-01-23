const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    amount: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    commission: {
      type: Schema.Types.ObjectId,
      ref: 'Commission'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Transaction", transactionSchema);
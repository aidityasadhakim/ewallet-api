import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["withdrawal", "deposit", "transfer"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  destinationAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
});

transactionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

transactionSchema.set("toJSON", {
  virtuals: true,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

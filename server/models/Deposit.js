const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  depositCode: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  bankCode: {
    type: String,
    default: "MB",
  },
  accountNumber: {
    type: String,
    default: "0988889999",
  },
  accountName: {
    type: String,
    default: "CHINH DEV GAMING",
  },
  transferMemo: {
    type: String,
    required: true,
  },
  qrImageUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Deposit", depositSchema);

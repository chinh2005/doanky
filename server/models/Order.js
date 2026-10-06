const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderCode: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      itemType: {
        type: String,
        enum: ["account", "card"],
        required: true,
      },
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      cardBrand: String,
      denomination: Number,
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["wallet", "vietqr"],
    default: "wallet",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  deliveredData: [
    {
      itemType: {
        type: String,
        enum: ["account", "card"],
      },
      title: String,
      accountUsername: String,
      accountPassword: String,
      accountNote: String,
      cardBrand: String,
      denomination: Number,
      serialNumber: String,
      pinCode: String,
    },
  ],
  qrCodeData: {
    bankCode: String,
    accountNumber: String,
    accountName: String,
    amount: Number,
    memo: String,
    qrImageUrl: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);

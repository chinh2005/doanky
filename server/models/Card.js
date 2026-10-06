const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["game", "phone"],
    required: true,
  },
  brand: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  discountRate: {
    type: Number,
    default: 5,
  },
  denominations: [
    {
      value: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        default: 99,
      },
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Card", cardSchema);

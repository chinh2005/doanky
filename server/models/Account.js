const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  game: {
    type: String,
    required: true,
    enum: [
      "PUBG",
      "Valorant",
      "Liên Quân",
      "Genshin Impact",
      "Free Fire",
      "FC Online",
      "Tốc Chiến",
    ],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  rank: {
    type: String,
    default: "Chưa xếp hạng",
  },
  skinCount: {
    type: Number,
    default: 0,
  },
  heroCount: {
    type: Number,
    default: 0,
  },
  loginType: {
    type: String,
    default: "Trắng thông tin",
  },
  images: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    default: "",
  },
  accountDetails: {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "Đổi mật khẩu ngay sau khi nhận tài khoản.",
    },
  },
  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },
  badge: {
    type: String,
    default: "HOT",
  },
  highlightSkins: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Account", accountSchema);

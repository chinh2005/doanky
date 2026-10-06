const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "chinh2_cyber_gaming_secret_key_2026",
    {
      expiresIn: "7d",
    },
  );
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin." });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "Email này đã được sử dụng." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      balance: 100000,
      role: "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
      avatar: user.avatar,
      vipLevel: user.vipLevel,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
      avatar: user.avatar,
      vipLevel: user.vipLevel,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/demo-login", async (req, res) => {
  try {
    const { role } = req.body;
    const targetEmail = role === "admin" ? "admin@demo.com" : "user@demo.com";
    let user = await User.findOne({ email: targetEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("demo123", salt);
      user = await User.create({
        name:
          role === "admin" ? "Quản Trị Viên (Demo)" : "Khách Hàng Vip (Demo)",
        email: targetEmail,
        password: hashedPassword,
        role: role === "admin" ? "admin" : "user",
        balance: role === "admin" ? 99000000 : 5000000,
        vipLevel: role === "admin" ? 9 : 3,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      balance: user.balance,
      avatar: user.avatar,
      vipLevel: user.vipLevel,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      balance: updatedUser.balance,
      avatar: updatedUser.avatar,
      vipLevel: updatedUser.vipLevel,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

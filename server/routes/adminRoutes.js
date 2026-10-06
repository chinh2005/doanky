const express = require("express");
const router = express.Router();
const Account = require("../models/Account");
const Card = require("../models/Card");
const Order = require("../models/Order");
const Deposit = require("../models/Deposit");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect);
router.use(adminOnly);

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAccounts = await Account.countDocuments();
    const availableAccounts = await Account.countDocuments({
      status: "available",
    });
    const soldAccounts = await Account.countDocuments({ status: "sold" });
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.find({ paymentStatus: "completed" });
    const totalRevenue = completedOrders.reduce(
      (sum, ord) => sum + (ord.totalAmount || 0),
      0,
    );
    const pendingDeposits = await Deposit.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalAccounts,
      availableAccounts,
      soldAccounts,
      totalOrders,
      totalRevenue,
      pendingDeposits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/accounts", async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/accounts", async (req, res) => {
  try {
    const {
      game,
      title,
      code,
      price,
      originalPrice,
      rank,
      skinCount,
      heroCount,
      loginType,
      images,
      description,
      accountDetails,
      badge,
      highlightSkins,
    } = req.body;

    if (
      !game ||
      !title ||
      !price ||
      !accountDetails?.username ||
      !accountDetails?.password
    ) {
      return res.status(400).json({
        message: "Vui lòng điền đủ thông tin cơ bản và tài khoản bàn giao.",
      });
    }

    const generatedCode =
      code ||
      `${game.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAccount = await Account.create({
      game,
      title,
      code: generatedCode,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      rank: rank || "Chưa xếp hạng",
      skinCount: Number(skinCount) || 0,
      heroCount: Number(heroCount) || 0,
      loginType: loginType || "Trắng thông tin",
      images:
        Array.isArray(images) && images.length > 0
          ? images
          : ["/img/anh_acc_default.png"],
      description: description || "",
      accountDetails: {
        username: accountDetails.username,
        password: accountDetails.password,
        note: accountDetails.note || "Bảo hành 100% đổi mật khẩu sau khi nhận.",
      },
      badge: badge || "HOT",
      highlightSkins: Array.isArray(highlightSkins) ? highlightSkins : [],
    });

    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/accounts/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản." });
    }

    const fields = [
      "game",
      "title",
      "code",
      "price",
      "originalPrice",
      "rank",
      "skinCount",
      "heroCount",
      "loginType",
      "images",
      "description",
      "status",
      "badge",
      "highlightSkins",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        account[field] = req.body[field];
      }
    });

    if (req.body.accountDetails) {
      if (req.body.accountDetails.username)
        account.accountDetails.username = req.body.accountDetails.username;
      if (req.body.accountDetails.password)
        account.accountDetails.password = req.body.accountDetails.password;
      if (req.body.accountDetails.note)
        account.accountDetails.note = req.body.accountDetails.note;
    }

    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/accounts/:id", async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản cần xoá." });
    }
    res.json({ message: "Đã xoá tài khoản thành công." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find().sort({ type: 1, brand: 1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/cards/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Không tìm thấy thẻ." });
    }

    if (req.body.discountRate !== undefined)
      card.discountRate = Number(req.body.discountRate);
    if (req.body.status !== undefined) card.status = req.body.status;
    if (req.body.denominations !== undefined)
      card.denominations = req.body.denominations;

    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/deposits", async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/deposits/:id/approve", async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy yêu cầu nạp tiền." });
    }

    if (deposit.status === "completed") {
      return res
        .status(400)
        .json({ message: "Yêu cầu này đã được duyệt trước đó." });
    }

    deposit.status = "completed";
    await deposit.save();

    const user = await User.findById(deposit.user);
    if (user) {
      user.balance += deposit.amount;
      await user.save();
    }

    res.json({ message: "Đã duyệt yêu cầu nạp tiền thành công!", deposit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

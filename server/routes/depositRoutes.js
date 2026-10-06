const express = require("express");
const router = express.Router();
const Deposit = require("../models/Deposit");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const bankConfig = require("../config/bankConfig");

router.post("/", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 10000) {
      return res
        .status(400)
        .json({ message: "Số tiền nạp tối thiểu là 10.000đ." });
    }

    const bankCode = bankConfig.bankCode;
    const accountNumber = bankConfig.accountNumber;
    const accountName = bankConfig.accountName;
    const depositCode =
      "NAP" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
    const transferMemo = `${depositCode} ${req.user.name.replace(/[^a-zA-Z0-9]/g, "")}`;

    const qrImageUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${numAmount}&addInfo=${encodeURIComponent(transferMemo)}&accountName=${encodeURIComponent(accountName)}`;

    const deposit = await Deposit.create({
      user: req.user._id,
      depositCode,
      amount: numAmount,
      bankCode,
      accountNumber,
      accountName,
      transferMemo,
      qrImageUrl,
      status: "pending",
    });

    res.status(201).json(deposit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/confirm", protect, async (req, res) => {
  try {
    const deposit = await Deposit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deposit) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giao dịch nạp tiền." });
    }

    if (deposit.status === "completed") {
      return res.json({
        message: "Giao dịch đã được cộng tiền trước đó.",
        deposit,
      });
    }

    deposit.status = "completed";
    await deposit.save();

    const user = await User.findById(req.user._id);
    user.balance += deposit.amount;
    await user.save();

    res.json({
      success: true,
      message: `Nạp thành công +${deposit.amount.toLocaleString("vi-VN")}đ vào ví!`,
      deposit,
      newBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-deposits", protect, async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Account = require("../models/Account");
const Card = require("../models/Card");
const { protect } = require("../middleware/authMiddleware");
const bankConfig = require("../config/bankConfig");

const generateRandomCode = (length = 12) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateRandomNumber = (length = 14) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

router.post("/checkout", protect, async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng đang trống." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (item.itemType === "account") {
        const acc = await Account.findById(item.accountId);
        if (!acc) {
          return res
            .status(400)
            .json({ message: `Tài khoản ${item.title || ""} không tồn tại.` });
        }
        if (acc.status === "sold") {
          return res.status(400).json({
            message: `Tài khoản [${acc.code}] ${acc.title} đã có người khác mua.`,
          });
        }
        calculatedTotal += acc.price;
        validatedItems.push({
          itemType: "account",
          account: acc._id,
          price: acc.price,
          quantity: 1,
          title: `[${acc.game}] ${acc.title}`,
        });
      } else if (item.itemType === "card") {
        const card = await Card.findOne({ brand: item.cardBrand });
        if (!card) {
          return res
            .status(400)
            .json({ message: `Loại thẻ ${item.cardBrand} không tồn tại.` });
        }
        const denom = Number(item.denomination);
        const qty = Number(item.quantity) || 1;
        const finalPrice =
          Math.round(denom * (1 - card.discountRate / 100)) * qty;
        calculatedTotal += finalPrice;
        validatedItems.push({
          itemType: "card",
          cardBrand: card.brand,
          denomination: denom,
          quantity: qty,
          price: finalPrice,
          title: `Thẻ ${card.name} ${denom.toLocaleString("vi-VN")}đ (x${qty})`,
        });
      }
    }

    const orderCode =
      "DH" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

    if (paymentMethod === "wallet") {
      if (user.balance < calculatedTotal) {
        return res.status(400).json({
          message: `Số dư ví không đủ (Hiện có: ${user.balance.toLocaleString("vi-VN")}đ, Cần: ${calculatedTotal.toLocaleString("vi-VN")}đ). Vui lòng nạp thêm tiền!`,
        });
      }

      user.balance -= calculatedTotal;
      await user.save();

      const deliveredData = [];

      for (const item of validatedItems) {
        if (item.itemType === "account") {
          const acc = await Account.findById(item.account);
          acc.status = "sold";
          await acc.save();

          deliveredData.push({
            itemType: "account",
            title: item.title,
            accountUsername: acc.accountDetails.username,
            accountPassword: acc.accountDetails.password,
            accountNote: acc.accountDetails.note,
          });
        } else if (item.itemType === "card") {
          for (let i = 0; i < item.quantity; i++) {
            deliveredData.push({
              itemType: "card",
              title: item.title,
              cardBrand: item.cardBrand,
              denomination: item.denomination,
              serialNumber: "SR" + generateRandomNumber(12),
              pinCode: generateRandomNumber(14),
            });
          }
        }
      }

      const order = await Order.create({
        user: user._id,
        orderCode,
        items: validatedItems,
        totalAmount: calculatedTotal,
        paymentMethod: "wallet",
        paymentStatus: "completed",
        deliveredData,
      });

      return res.status(201).json({
        success: true,
        message: "Thanh toán thành công qua số dư ví!",
        order,
        remainingBalance: user.balance,
      });
    }

    const bankCode = bankConfig.bankCode;
    const accountNumber = bankConfig.accountNumber;
    const accountName = bankConfig.accountName;
    const memo = `DH${orderCode}`;
    const qrImageUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${calculatedTotal}&addInfo=${memo}&accountName=${encodeURIComponent(accountName)}`;

    const order = await Order.create({
      user: user._id,
      orderCode,
      items: validatedItems,
      totalAmount: calculatedTotal,
      paymentMethod: "vietqr",
      paymentStatus: "pending",
      qrCodeData: {
        bankCode,
        accountNumber,
        accountName,
        amount: calculatedTotal,
        memo,
        qrImageUrl,
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công, vui lòng quét mã QR để thanh toán.",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/confirm-qr", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    if (order.paymentStatus === "completed") {
      return res.json({
        success: true,
        message: "Đơn hàng đã hoàn tất trước đó.",
        order,
      });
    }

    const deliveredData = [];

    for (const item of order.items) {
      if (item.itemType === "account") {
        const acc = await Account.findById(item.account);
        if (acc) {
          acc.status = "sold";
          await acc.save();

          deliveredData.push({
            itemType: "account",
            title: item.title,
            accountUsername: acc.accountDetails.username,
            accountPassword: acc.accountDetails.password,
            accountNote: acc.accountDetails.note,
          });
        }
      } else if (item.itemType === "card") {
        for (let i = 0; i < item.quantity; i++) {
          deliveredData.push({
            itemType: "card",
            title: item.title,
            cardBrand: item.cardBrand,
            denomination: item.denomination,
            serialNumber: "SR" + generateRandomNumber(12),
            pinCode: generateRandomNumber(14),
          });
        }
      }
    }

    order.paymentStatus = "completed";
    order.deliveredData = deliveredData;
    await order.save();

    res.json({
      success: true,
      message:
        "Xác nhận thanh toán thành công! Đã bàn giao thông tin tài khoản/thẻ.",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

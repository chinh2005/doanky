require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const cardRoutes = require("./routes/cardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const depositRoutes = require("./routes/depositRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

const path = require("path");

app.use(express.json());
app.use("/img", express.static(path.join(__dirname, "../client/public/img")));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Shop Game & Card API System Running Smoothly",
    timestamp: new Date(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Lỗi hệ thống máy chủ",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

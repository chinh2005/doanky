const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "chinh2_cyber_gaming_secret_key_2026",
      );
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Tài khoản không tồn tại hoặc đã bị xoá." });
      }
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
  } else {
    return res.status(401).json({ message: "Yêu cầu đăng nhập để thực hiện." });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền quản trị viên." });
  }
};

module.exports = { protect, adminOnly };

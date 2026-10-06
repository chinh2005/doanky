const express = require("express");
const router = express.Router();
const Account = require("../models/Account");

router.get("/", async (req, res) => {
  try {
    const { game, search, minPrice, maxPrice, rank, sort, status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = "available";
    }

    if (game && game !== "Tất cả") {
      query.game = game;
    }

    if (rank && rank !== "Tất cả") {
      query.rank = rank;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { code: searchRegex },
        { description: searchRegex },
        { highlightSkins: searchRegex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "skins_desc") sortOption = { skinCount: -1 };

    const accounts = await Account.find(query)
      .select("-accountDetails.password")
      .sort(sortOption);

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const games = [
      "PUBG",
      "Valorant",
      "Liên Quân",
      "Genshin Impact",
      "Free Fire",
      "FC Online",
      "Tốc Chiến",
    ];
    const summary = await Promise.all(
      games.map(async (g) => {
        const count = await Account.countDocuments({
          game: g,
          status: "available",
        });
        return { game: g, count };
      }),
    );
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).select(
      "-accountDetails.password",
    );
    if (!account) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản game." });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

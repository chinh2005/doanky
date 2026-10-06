const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

router.get("/", async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { status: "active" };

    if (type && type !== "all") {
      query.type = type;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [{ brand: searchRegex }, { name: searchRegex }];
    }

    const cards = await Card.find(query).sort({ type: 1, brand: 1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:brand", async (req, res) => {
  try {
    const card = await Card.findOne({
      brand: req.params.brand,
      status: "active",
    });
    if (!card) {
      return res.status(404).json({ message: "Không tìm thấy loại thẻ này." });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

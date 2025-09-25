const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// ----------------------
// @route   GET /categories
// @desc    Get all categories with options
// ----------------------
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// @route   GET /categories/:id
// @desc    Get single category by ID
// ----------------------
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

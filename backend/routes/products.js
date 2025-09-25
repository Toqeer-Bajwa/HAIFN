const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ----------------------
// route   GET /products
// desc    Get all products (PUBLIC)
// ----------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// route   GET /products/featured
// desc    Get featured products (PUBLIC)
// ----------------------
router.get("/featured", async (req, res) => {
  try {
    console.log("⚡ Fetching featured products..."); // Debug start
    const featuredProducts = await Product.find({ featured: true }).populate("category");
    console.log("✅ Featured products found:", featuredProducts);
    res.json(featuredProducts);
  } catch (err) {
    console.error("❌ Featured products error:", err); // Show real error
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// route   GET /products/category/:categoryId
// desc    Get all products for a specific category (PUBLIC)
// ----------------------
router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate("category");
    res.json(products);
  } catch (err) {
    console.error("Error fetching products by category:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------
// route   GET /products/:id
// desc    Get product by ID (PUBLIC)
// ----------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

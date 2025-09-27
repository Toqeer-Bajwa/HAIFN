const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");
const Product = require("../models/Product");
const Category = require("../models/Category");
const fs = require("fs");

//Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,"..","public", "uploads")); // ✅ always consistent
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ✅ Only allow image files
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, jpeg, png, gif)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});
// ✅ Create Product
router.post("/products", verifyToken, checkAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, option, featured } = req.body;

    // validate category
    const cat = await Category.findById(category);
    if (!cat) return res.status(400).json({ error: "Invalid category" });

    // validate option belongs to category
    if (!cat.options.includes(option)) {
      return res
        .status(400)
        .json({ error: `Option '${option}' is not valid for category ${cat.name}` });
    }

    const product = new Product({
      name,
      description,
      category,
      option,
      featured: featured === "on" || featured === "true" || featured === true,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await product.save();
    res.status(201).json({ message: "✅ Product created", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get All Products
router.get("/products", verifyToken, checkAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name options");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update Product
router.put("/products/:id", verifyToken, checkAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, option, featured } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (category) {
      const cat = await Category.findById(category);
      if (!cat) return res.status(400).json({ error: "Invalid category" });
      if (option && !cat.options.includes(option)) {
        return res
          .status(400)
          .json({ error: `Option '${option}' is not valid for category ${cat.name}` });
      }
      product.category = category;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.option = option || product.option;
    if (featured !== undefined) {
    product.featured = featured === "on" || featured === "true" || featured === true;
    }


    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json({ message: "✅ Product updated", product });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete Product
router.delete("/products/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.image) {
      fs.unlink(path.join(__dirname, "..", "public", product.image), err => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    res.json({ message: "🗑️ Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Mark Product as Featured (for slider)
router.patch("/products/:id/feature", verifyToken, checkAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.featured = !product.featured; // toggle
    await product.save();

    res.json({
      message: product.featured
        ? "⭐ Product marked as featured"
        : "❌ Product removed from featured",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

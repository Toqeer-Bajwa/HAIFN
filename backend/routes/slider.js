const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Slider = require("../models/Slider");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// --------------------
// Multer setup (for slider images)
// --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads/slider");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
  });
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

// --------------------
// @route   POST /api/admin/slider
// @desc    Add new slider image (Admin only)
// --------------------
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newSlide = new Slider({
      image: `/uploads/slider/${req.file.filename}`,
      title,
      link,
    });

    await newSlide.save();
    res.json({ message: "✅ Slider added successfully", slide: newSlide });
  } catch (err) {
    console.error("❌ Slider upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------
// @route   GET /api/slider
// @desc    Get all slider images (Public)
// --------------------
router.get("/", async (req, res) => {
  try {
    const slides = await Slider.find().sort({ createdAt: -1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------
// @route   DELETE /api/admin/slider/:id
// @desc    Delete slider image (Admin only)
// --------------------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const slide = await Slider.findById(req.params.id);
    if (!slide) return res.status(404).json({ error: "Slide not found" });

    // Delete image file
    const filePath = path.join(__dirname, "../public", slide.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await slide.deleteOne();
    res.json({ message: "✅ Slide deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

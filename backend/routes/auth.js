const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ----------------------
// @route   POST /auth/login
// @desc    Login admin (only admin allowed)
// ----------------------
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("🟢 Login attempt:", username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ Only allow admins
    if (user.role !== "admin") {
      console.log("⛔ Unauthorized role:", user.role);
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful for", user.username);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;

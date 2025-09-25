const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST /contact → Save message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ message: "✅ Message saved successfully" });
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// (Optional) GET all messages (Admin only, for later)
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

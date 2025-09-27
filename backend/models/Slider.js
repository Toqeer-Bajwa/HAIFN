const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  title: { type: String },
  link: { type: String },
  image: { type: String, required: true }, // uploaded file path
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Slide", slideSchema);
// backend/models/Slider.js
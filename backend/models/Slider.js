const mongoose = require("mongoose");

const SliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  link: { type: String }, // can link to product or external page
}, { timestamps: true });

module.exports = mongoose.model("Slider", SliderSchema);
// --------------------
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    option: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // we’ll store image filename or URL (uploaded via Multer)
      required: true,
    },
    featured: {
      type: Boolean,
      default: false, // for homepage slider
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

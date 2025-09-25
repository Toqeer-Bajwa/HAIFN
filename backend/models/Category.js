const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  options: [
    {
      type: String,
      required: true,
      trim: true
    }
  ]
});

module.exports = mongoose.model("Category", categorySchema);

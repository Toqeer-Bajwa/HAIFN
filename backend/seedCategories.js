require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB Connected...");

    // Clear existing categories first (optional)
    await Category.deleteMany();

    const categories = [
      { name: 'LED Bulb', options: ['5W', '13W', '18W', '30W', '40W', '50W'] },
      { name: 'SMD Downlight', options: ['7W', '12W'] },
      { name: 'Moon Light', options: ['12W', '18W', '24W', '36W'] },
      { name: 'COB Light', options: ['5W'] },
      { name: 'Batten Lights', options: ['20W', '40W', '60W'] },
      { name: 'Flood Lights', options: ['30W', '50W', '100W'] },
      { name: 'Panel Lights', options: ['6W', '12W', '18W'] },
      { name: 'Rope Light', options: ['White', 'Warm White', 'Red', 'Pink', 'Green', 'Blue', 'Multi'] }
    ];

    await Category.insertMany(categories);

    console.log("✅ HAIFN Categories Seeded Successfully!");
    process.exit();
  })
  .catch((err) => console.error(err));

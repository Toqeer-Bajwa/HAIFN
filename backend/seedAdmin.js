require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin already exists
    const exists = await User.findOne({ username: process.env.ADMIN_USERNAME });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Hash password from env
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Create admin user
    const admin = new User({
      username: process.env.ADMIN_USERNAME,
      password: hashed,
      role: "admin"
    });

    await admin.save();
    console.log(`✅ Admin user created: username=${process.env.ADMIN_USERNAME}, password=${process.env.ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

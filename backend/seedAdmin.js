require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const exists = await User.findOne({ username: "admin" });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }
    const hashed = await bcrypt.hash("haifn123", 10);
    const admin = new User({ username: "admin", password: hashed, role: "admin" });
    await admin.save();
    console.log("✅ Admin user created: username=admin, password=haifn123");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

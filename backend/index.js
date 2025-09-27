require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Import DB connection 
const connectDB = require('./db');

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Routes
// --------------------
const categoriesRoute = require("./routes/categories");
const productsRoute = require("./routes/products"); // public
const authRoute = require("./routes/auth");
const contactRoute = require("./routes/contact"); // public
const adminRoute = require("./routes/admin");       // admin-only
const sliderRoute = require("./routes/slider");   //admin-only

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Public routes
app.use('/api/categories', categoriesRoute);
app.use('/api/products', productsRoute);
app.use('/api/auth', authRoute);
app.use('/api/contact', contactRoute);
app.use('/api/slider', sliderRoute); // Public slider viewing

// Serve uploaded images statically

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Admin routes
app.use('/api/admin', adminRoute);
app.use('/api/admin/slider', sliderRoute); // Admin slider management
// Static Files
app.use(express.static(path.join(__dirname, 'public')));


// ⚡ Global error handler (ONE TIME ONLY)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong, please try again later." });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 HAIFN server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB, server not started', err);
    process.exit(1);
  });
// module.exports = app; // for testing
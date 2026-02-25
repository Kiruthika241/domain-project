// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Default Route
app.get("/", (req, res) => res.send("API running"));


const path = require("path");

// Static folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/products", require("./routes/productRoutes"));

app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

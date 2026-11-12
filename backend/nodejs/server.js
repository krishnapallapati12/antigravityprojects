/**
 * Enterprise Express.js Server for Jai Krishna Ram 100-Acre Luxury Farmhouse & Sanctuary
 */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

const resortRoutes = require("./routes/resortRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Logging Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health & Metadata Route
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    service: "Jai Krishna Ram Farmhouse Backend (Node.js & Express)",
    estate: "100-Acre Private Sanctuary in Central Hyderabad (Near HITEC City)",
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use("/api/v1/resorts", resortRoutes);
app.use("/api/v1/pricing", pricingRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error in Resort Booking Engine",
    error: err.message
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏰 Jai Krishna Ram Resort Backend Running`);
    console.log(`🚀 Port: http://localhost:${PORT}`);
    console.log(`📍 Estate: 100-Acre Sanctuary, HITEC City, Hyderabad`);
    console.log(`=======================================================`);
  });
}

module.exports = app;


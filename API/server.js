import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routers
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import paymentRouter from "./Routes/payment.js";
import wishlistRouter from "./Routes/wishlist.js";
import reviewRouter from "./Routes/review.js";
import couponRouter from "./Routes/coupon.js";
import contactRouter from "./Routes/contact.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS configuration: allows production frontend, Vercel preview URLs, and local development
const allowedOrigins = [
  "https://e-commerce-shivam-shdp.vercel.app",
  "https://e-commerce-shivam.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Auth"],
    credentials: true,
  })
);

// Respond to preflight OPTIONS requests cleanly
app.options("*", cors());

// Robust Serverless MongoDB connection caching
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState >= 1) {
    return cachedDb;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("CRITICAL: MONGO_URI is not set in environment variables!");
    throw new Error(
      "MONGO_URI environment variable is missing. Please set MONGO_URI in your Vercel Project Settings > Environment Variables."
    );
  }

  try {
    cachedDb = await mongoose.connect(uri, {
      dbName: "MERN_E_Commerce",
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully.");
    return cachedDb;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Root Health Check Route (does not crash if DB connection is in progress)
app.get("/", (req, res) =>
  res.json({
    message: "MERN E-Commerce API is running smoothly",
    version: "2.0.0",
    status: "Healthy",
    mongoConnected: mongoose.connection.readyState === 1,
  })
);

app.get("/api/health", (req, res) =>
  res.json({
    status: "Healthy",
    time: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1,
  })
);

// Database connection middleware for all API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed: " + error.message,
      hint: "Make sure MONGO_URI is added in Vercel Environment Variables and MongoDB Atlas IP access allows 0.0.0.0/0",
    });
  }
});

// API Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/contact", contactRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
  });
});

// Start local server only outside of Vercel serverless environment
if (!process.env.VERCEL) {
  const port = process.env.PORT || 2000;
  connectDB().catch((err) =>
    console.warn("Initial DB connection warning:", err.message)
  );
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default app;
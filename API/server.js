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

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Health / Home route
app.get("/", (req, res) =>
  res.json({
    message: "MERN E-Commerce API is running smoothly",
    version: "2.0.0",
    status: "Healthy",
  })
);

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

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://shivamsinghmahewa7698_db_user:aKCoWAa4mJMYF3hG@cluster0.chl73tb.mongodb.net/";

mongoose
  .connect(MONGO_URI, {
    dbName: "MERN_E_Commerce",
  })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((error) => console.log("MongoDB connection error:", error));

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

export default app;
import express from "express";
import {
  applyCoupon,
  createCoupon,
  getAllCoupons,
} from "../Controllers/coupon.js";
import { Authenticated, AdminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Apply coupon (Authenticated)
router.post("/apply", Authenticated, applyCoupon);

// Admin routes
router.post("/create", Authenticated, AdminOnly, createCoupon);
router.get("/all", Authenticated, AdminOnly, getAllCoupons);

export default router;

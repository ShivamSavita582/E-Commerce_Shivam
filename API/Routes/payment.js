import express from "express";
import {
  allOrders,
  checkout,
  userOrder,
  verify,
  getOrderById,
  updateOrderStatus,
} from "../Controllers/payment.js";
import { Authenticated, AdminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Checkout
router.post("/checkout", checkout);

// Verify payment & save to db
router.post("/verify-payment", verify);

// User orders
router.get("/userorder", Authenticated, userOrder);

// Single order by ID
router.get("/order/:id", Authenticated, getOrderById);

// All orders (Admin Only)
router.get("/orders", Authenticated, AdminOnly, allOrders);

// Update order status (Admin)
router.put("/status/:id", Authenticated, AdminOnly, updateOrderStatus);

export default router;
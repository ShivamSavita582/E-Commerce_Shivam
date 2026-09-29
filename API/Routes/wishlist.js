import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  clearWishlist,
  checkWishlist,
} from "../Controllers/wishlist.js";
import { Authenticated } from "../middlewares/auth.js";

const router = express.Router();

// Add to wishlist
router.post("/add/:productId", Authenticated, addToWishlist);

// Remove from wishlist
router.delete("/remove/:productId", Authenticated, removeFromWishlist);

// Get user wishlist
router.get("/user", Authenticated, getUserWishlist);

// Clear wishlist
router.delete("/clear", Authenticated, clearWishlist);

// Check if product is in wishlist
router.get("/check/:productId", Authenticated, checkWishlist);

export default router;

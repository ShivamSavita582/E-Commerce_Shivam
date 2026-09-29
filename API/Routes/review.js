import express from "express";
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../Controllers/review.js";
import { Authenticated } from "../middlewares/auth.js";

const router = express.Router();

// Get reviews for product (public)
router.get("/product/:productId", getProductReviews);

// Add review (authenticated)
router.post("/", Authenticated, addReview);

// Update review (authenticated)
router.put("/:id", Authenticated, updateReview);

// Delete review (authenticated)
router.delete("/:id", Authenticated, deleteReview);

export default router;

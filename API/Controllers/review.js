import mongoose from "mongoose";
import { Review } from "../Models/Review.js";
import { Products } from "../Models/Product.js";

// Helper to update product average rating
const updateProductRating = async (productId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Products.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].numReviews,
      });
    } else {
      await Products.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error("Error updating product rating:", err);
  }
};

// Add product review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;
    const userName = req.user.name || "Customer";

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "Please provide product ID, rating (1-5), and comment",
        success: false,
      });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ userId, productId });
    if (existing) {
      return res.status(409).json({
        message: "You have already reviewed this product. You can update your review instead.",
        success: false,
      });
    }

    const review = await Review.create({
      userId,
      productId,
      userName,
      rating: Number(rating),
      comment,
    });

    await updateProductRating(productId);

    res.status(201).json({
      message: "Review added successfully",
      review,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
      success: false,
    });
  }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    res.json({
      reviews,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
      success: false,
    });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: id, userId });
    if (!review) {
      return res.status(404).json({
        message: "Review not found or unauthorized",
        success: false,
      });
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;

    await review.save();
    await updateProductRating(review.productId);

    res.json({
      message: "Review updated successfully",
      review,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update review",
      error: error.message,
      success: false,
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findOneAndDelete({
      _id: id,
      $or: [{ userId }, { ...(req.user.role === "admin" ? {} : { userId }) }],
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or unauthorized",
        success: false,
      });
    }

    await updateProductRating(review.productId);

    res.json({
      message: "Review deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
      success: false,
    });
  }
};

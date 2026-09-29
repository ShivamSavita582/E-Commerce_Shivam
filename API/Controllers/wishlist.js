import mongoose from "mongoose";
import { Wishlist } from "../Models/Wishlist.js";
import { Products } from "../Models/Product.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID format",
        success: false,
      });
    }

    const productExists = await Products.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    const isAlreadyAdded = wishlist.products.some(
      (item) => item.productId.toString() === productId
    );

    if (isAlreadyAdded) {
      return res.status(409).json({
        message: "Product already in wishlist",
        success: false,
      });
    }

    wishlist.products.push({ productId, addedAt: new Date() });
    await wishlist.save();

    // Populate for clean response
    await wishlist.populate("products.productId");

    res.status(201).json({
      message: "Product added to wishlist successfully",
      wishlist,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add to wishlist",
      error: error.message,
      success: false,
    });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID format",
        success: false,
      });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
        success: false,
      });
    }

    const initialLength = wishlist.products.length;
    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );

    if (wishlist.products.length === initialLength) {
      return res.status(404).json({
        message: "Product was not found in your wishlist",
        success: false,
      });
    }

    await wishlist.save();
    await wishlist.populate("products.productId");

    res.json({
      message: "Product removed from wishlist",
      wishlist,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove from wishlist",
      error: error.message,
      success: false,
    });
  }
};

// Get user wishlist
export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ userId }).populate(
      "products.productId"
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    // Filter out any populated products that may have been deleted from DB
    const validProducts = wishlist.products.filter(
      (item) => item.productId !== null
    );
    if (validProducts.length !== wishlist.products.length) {
      wishlist.products = validProducts;
      await wishlist.save();
    }

    res.json({
      message: "User wishlist fetched successfully",
      wishlist,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wishlist",
      error: error.message,
      success: false,
    });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    } else {
      wishlist.products = [];
    }

    await wishlist.save();

    res.json({
      message: "Wishlist cleared successfully",
      wishlist,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear wishlist",
      error: error.message,
      success: false,
    });
  }
};

// Check if a product is in user's wishlist
export const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
        inWishlist: false,
        success: false,
      });
    }

    const wishlist = await Wishlist.findOne({ userId });
    const inWishlist = wishlist
      ? wishlist.products.some(
          (item) => item.productId.toString() === productId
        )
      : false;

    res.json({
      productId,
      inWishlist,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking wishlist",
      error: error.message,
      success: false,
    });
  }
};

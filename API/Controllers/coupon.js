import { Coupon } from "../Models/Coupon.js";

// Validate and apply coupon
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required", success: false });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or inactive coupon code", success: false });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: "Coupon has expired", success: false });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached", success: false });
    }

    const orderAmount = Number(cartTotal) || 0;
    if (orderAmount < coupon.minimumOrder) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.minimumOrder} required to use this coupon`,
        success: false,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;
    const finalTotal = Math.max(0, orderAmount - discountAmount);

    res.json({
      message: `Coupon '${coupon.code}' applied successfully! Saved ₹${discountAmount}`,
      code: coupon.code,
      discountAmount,
      finalTotal,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Create coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ message: "Coupon created successfully", coupon, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Get all coupons (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

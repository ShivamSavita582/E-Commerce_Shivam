import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    brand: {
      type: String,
      trim: true,
      default: "Generic",
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    qty: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    imgSrc: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    warranty: {
      type: String,
      default: "1 Year Official Warranty",
    },
    returnPolicy: {
      type: String,
      default: "7 Days Return Policy",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    freeShipping: {
      type: Boolean,
      default: true,
    },
    deliveryDays: {
      type: Number,
      default: 3,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Search text index
productSchema.index({
  title: "text",
  description: "text",
  brand: "text",
  category: "text",
});

// Category and price indexes
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1, isBestSeller: 1, isNewArrival: 1 });

export const Products = mongoose.model("Products", productSchema);
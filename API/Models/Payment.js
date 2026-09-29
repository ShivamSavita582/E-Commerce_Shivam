import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number },
    orderItems: { type: Array, default: [] },
    userId: { type: String },
    userShipping: { type: Object, default: {} },
    orderDate: { type: Date, default: Date.now },
    payStatus: { type: String, default: "paid" },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Confirmed",
    },
  },
  { strict: false, timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
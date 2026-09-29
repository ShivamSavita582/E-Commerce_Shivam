import { Payment } from "../Models/Payment.js";
import { Products } from "../Models/Product.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SKj75OJp54Vz8m",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "f2m9dp35JODjuesaW6zdY4Vl",
});

// Checkout - Create Razorpay order
export const checkout = async (req, res) => {
  const { amount, cartItems, userShipping, userId } = req.body;

  try {
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: amount,
      cartItems,
      userShipping,
      userId,
      payStatus: "created",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Verify payment & Save to DB & Decrement Inventory
export const verify = async (req, res) => {
  const {
    orderId,
    paymentId,
    signature,
    amount,
    orderItems,
    userId,
    userShipping,
  } = req.body;

  try {
    let orderConfirm = await Payment.create({
      orderId,
      paymentId,
      signature,
      amount,
      orderItems,
      userId,
      userShipping,
      payStatus: "paid",
      orderStatus: "Confirmed",
    });

    // Decrement inventory for purchased products
    if (Array.isArray(orderItems)) {
      for (const item of orderItems) {
        const pId = item.productId || item._id;
        const purchaseQty = Number(item.qty) || 1;
        if (pId) {
          await Products.findByIdAndUpdate(pId, {
            $inc: { qty: -purchaseQty },
          });
        }
      }
    }

    res.json({
      message: "Payment successful and order confirmed!",
      success: true,
      orderConfirm,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// User specific orders
export const userOrder = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const orders = await Payment.find({ userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Payment.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderId: id }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found", success: false });
    }

    res.json({ order, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// All orders (Admin)
export const allOrders = async (req, res) => {
  try {
    let orders = await Payment.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Payment.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found", success: false });
    }

    res.json({
      message: `Order status updated to ${orderStatus}`,
      order,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

import api from "./api";

export const orderService = {
  // Checkout creation with Razorpay
  createCheckout: async (orderData) => {
    const response = await api.post("/payment/checkout", orderData);
    return response.data;
  },

  // Verify and confirm payment
  verifyPayment: async (paymentData) => {
    const response = await api.post("/payment/verify-payment", paymentData);
    return response.data;
  },

  // Get current user's orders
  getUserOrders: async () => {
    const response = await api.get("/payment/userorder");
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/payment/order/${id}`);
    return response.data;
  },

  // Get all orders (Admin)
  getAllOrders: async () => {
    const response = await api.get("/payment/orders");
    return response.data;
  },

  // Update order status (Admin)
  updateOrderStatus: async (id, orderStatus) => {
    const response = await api.put(`/payment/status/${id}`, { orderStatus });
    return response.data;
  },

  // Shipping Address
  addAddress: async (addressData) => {
    const response = await api.post("/address/add", addressData);
    return response.data;
  },

  getAddress: async () => {
    const response = await api.get("/address/get");
    return response.data;
  },
};

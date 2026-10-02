import api from "./api";

export const cartService = {
  getCart: async () => {
    const response = await api.get("/cart/user");
    return response.data;
  },

  addToCart: async (productId, title, price, qty, imgSrc) => {
    const response = await api.post("/cart/add", {
      productId,
      title,
      price,
      qty,
      imgSrc,
    });
    return response.data;
  },

  decreaseQty: async (productId, qty = 1) => {
    const response = await api.post("/cart/--qty", { productId, qty });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/cart/clear");
    return response.data;
  },
};

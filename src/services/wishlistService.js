import api from "./api";

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get("/wishlist/user");
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post(`/wishlist/add/${productId}`);
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  clearWishlist: async () => {
    const response = await api.delete("/wishlist/clear");
    return response.data;
  },

  checkWishlist: async (productId) => {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },
};

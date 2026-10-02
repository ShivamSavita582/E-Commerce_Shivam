import api from "./api";

export const couponService = {
  applyCoupon: async (code, cartTotal) => {
    const response = await api.post("/coupon/apply", { code, cartTotal });
    return response.data;
  },

  createCoupon: async (couponData) => {
    const response = await api.post("/coupon/create", couponData);
    return response.data;
  },

  getAllCoupons: async () => {
    const response = await api.get("/coupon/all");
    return response.data;
  },
};

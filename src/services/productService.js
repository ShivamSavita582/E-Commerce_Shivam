import api from "./api";

export const productService = {
  // Get products with optional pagination and filters
  getProducts: async (params = {}) => {
    const response = await api.get("/product/all", { params });
    return response.data;
  },

  // Get product by ID or Slug
  getProductById: async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },

  // Add new product (Admin)
  addProduct: async (productData) => {
    const response = await api.post("/product/add", productData);
    return response.data;
  },

  // Update product (Admin)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/product/${id}`, productData);
    return response.data;
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  },

  // Seed demo catalog products
  seedProducts: async () => {
    const response = await api.post("/product/seed");
    return response.data;
  },
};

import api from "./api";

export const contactService = {
  // Submit customer inquiry (Public or Authenticated)
  submitQuery: async (queryData) => {
    const response = await api.post("/contact/submit", queryData);
    return response.data;
  },

  // Get all customer inquiries (Admin)
  getAllQueries: async (params = {}) => {
    const response = await api.get("/contact/all", { params });
    return response.data;
  },

  // Get single inquiry details (Admin)
  getQueryById: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Update inquiry status & notes (Admin)
  updateStatus: async (id, updateData) => {
    const response = await api.put(`/contact/status/${id}`, updateData);
    return response.data;
  },

  // Delete inquiry (Admin)
  deleteQuery: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};

export default contactService;

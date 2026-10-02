import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/user/login", { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post("/user/register", { name, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/user/profile", data);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/user/all");
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put("/user/role", { userId, role });
    return response.data;
  },
};

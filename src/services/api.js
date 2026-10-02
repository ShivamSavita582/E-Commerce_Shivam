import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:2000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Auth"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & centralized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error.message || "An unexpected error occurred";

    if (status === 401) {
      // Clear token if expired
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        // Only redirect if not already on login/register
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          toast.error("Session expired. Please sign in again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1200);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };

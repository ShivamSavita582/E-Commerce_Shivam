import { useContext } from "react";
import AppContext from "../context/AppContext";

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAuth must be used within an AppState Provider");
  }
  return {
    user: context.user,
    token: context.token,
    isAuthenticated: context.isAuthenticated,
    isAdmin: context.user?.role === "admin",
    login: context.login,
    register: context.register,
    logout: context.logout,
    updateProfile: context.updateUserProfile,
  };
};

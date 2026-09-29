import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "!@#$%^&*()";

export const Authenticated = async (req, res, next) => {
  let token = req.header("Auth") || req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Login first", success: false });
  }

  // Handle Bearer <token> format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    let decode;
    try {
      decode = jwt.verify(token, JWT_SECRET);
    } catch {
      // Fallback verification for older tokens
      decode = jwt.verify(token, "!@#$%^&*()");
    }

    const id = decode.userId;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User does not exist", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Session expired or invalid token. Please login again.",
      success: false,
      error: error.message,
    });
  }
};

// Admin only middleware
export const AdminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
      success: false,
    });
  }
  next();
};
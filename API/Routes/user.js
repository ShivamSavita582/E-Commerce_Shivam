import express from "express";
import {
  login,
  profile,
  register,
  users,
  updateProfile,
  updateUserRole,
} from "../Controllers/user.js";
import { Authenticated, AdminOnly } from "../middlewares/auth.js";

const router = express.Router();

// register user
router.post("/register", register);

// login user
router.post("/login", login);

// get all users (Admin only)
router.get("/all", Authenticated, AdminOnly, users);

// get user profile
router.get("/profile", Authenticated, profile);

// update user profile
router.put("/profile", Authenticated, updateProfile);

// update user role (Admin only)
router.put("/role", Authenticated, AdminOnly, updateUserRole);

export default router;
import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "!@#$%^&*()";

// User Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashpass = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashpass,
      role: "user",
    });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "365d",
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: safeUser,
      token,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found with this email",
        success: false,
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "365d",
    });

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      avatar: user.avatar || "",
      createdAt: user.createdAt,
    };

    res.json({
      message: `Welcome ${user.name}`,
      token,
      user: safeUser,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Get All Users (Admin-friendly)
export const users = async (req, res) => {
  try {
    let users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Get User Profile
export const profile = async (req, res) => {
  try {
    res.json({ user: req.user, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Update/Toggle User Role (Admin Only)
export const updateUserRole = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Only store administrators can modify user roles",
        success: false,
      });
    }

    const { userId, role } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", success: false });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Protect primary master admin from being demoted
    if (targetUser.email === "admin@gmail.com" && role !== "admin") {
      return res.status(400).json({
        message: "The primary administrator account (admin@gmail.com) cannot be demoted.",
        success: false,
      });
    }

    targetUser.role = role === "admin" ? "admin" : "user";
    await targetUser.save();

    res.json({
      message: `User role successfully updated to ${targetUser.role}`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        createdAt: targetUser.createdAt,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};


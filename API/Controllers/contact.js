import { Contact } from "../Models/Contact.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "!@#$%^&*()";

// Helper: optionally extract user from token if present (for public/guest forms)
const extractOptionalUser = async (req) => {
  try {
    let token = req.header("Auth") || req.header("Authorization");
    if (!token) return null;
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }
    let decode;
    try {
      decode = jwt.verify(token, JWT_SECRET);
    } catch {
      decode = jwt.verify(token, "!@#$%^&*()");
    }
    if (decode?.userId) {
      const user = await User.findById(decode.userId).select("_id name email");
      return user || null;
    }
  } catch {
    return null;
  }
  return null;
};

// 1. Submit a customer contact query (Public or Authenticated)
export const submitContactQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Field presence validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, subject, and message.",
      });
    }

    // Name length validation
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long.",
      });
    }

    // Email regex validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Message length validation
    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please write a message of at least 10 characters.",
      });
    }

    // Optional user attachment
    let userId = req.user?._id || null;
    if (!userId) {
      const optionalUser = await extractOptionalUser(req);
      if (optionalUser) {
        userId = optionalUser._id;
      }
    }

    // Create the contact inquiry
    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      subject: subject.trim(),
      message: message.trim(),
      userId,
      status: "New",
      priority: "Normal",
    });

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been registered successfully! Our tech concierge will respond within 24 hours.",
      ticketId: newContact.ticketId,
      contact: newContact,
    });
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting your message. Please try again.",
      error: error.message,
    });
  }
};

// 2. Get all customer inquiries (Admin Only)
export const getAllContactQueries = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
        { ticketId: { $regex: term, $options: "i" } },
        { subject: { $regex: term, $options: "i" } },
        { message: { $regex: term, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const [queries, total] = await Promise.all([
      Contact.find(filter)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Contact.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      count: queries.length,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      queries,
    });
  } catch (error) {
    console.error("Error fetching contact queries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve customer inquiries",
      error: error.message,
    });
  }
};

// 3. Get single inquiry by ID (Admin Only)
export const getContactQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Contact.findById(id).populate("userId", "name email");

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Customer inquiry not found",
      });
    }

    return res.json({
      success: true,
      query,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching inquiry details",
      error: error.message,
    });
  }
};

// 4. Update inquiry status & admin resolution notes (Admin Only)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, adminNotes } = req.body;

    const updateFields = {};
    if (status) {
      updateFields.status = status;
      if (status === "Resolved" || status === "Closed") {
        updateFields.resolvedAt = new Date();
      }
    }
    if (priority) {
      updateFields.priority = priority;
    }
    if (typeof adminNotes === "string") {
      updateFields.adminNotes = adminNotes.trim();
    }

    const updated = await Contact.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Customer inquiry not found",
      });
    }

    return res.json({
      success: true,
      message: `Inquiry status updated to ${updated.status}`,
      query: updated,
    });
  } catch (error) {
    console.error("Error updating contact query:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update inquiry status",
      error: error.message,
    });
  }
};

// 5. Delete an inquiry (Admin Only)
export const deleteContactQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found or already deleted",
      });
    }

    return res.json({
      success: true,
      message: "Customer inquiry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete inquiry",
      error: error.message,
    });
  }
};

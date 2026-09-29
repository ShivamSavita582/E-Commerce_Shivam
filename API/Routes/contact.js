import express from "express";
import {
  submitContactQuery,
  getAllContactQueries,
  getContactQueryById,
  updateContactStatus,
  deleteContactQuery,
} from "../Controllers/contact.js";
import { Authenticated, AdminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Public / User route to submit customer inquiry
router.post("/submit", submitContactQuery);

// Protected Admin management routes
router.get("/all", Authenticated, AdminOnly, getAllContactQueries);
router.get("/:id", Authenticated, AdminOnly, getContactQueryById);
router.put("/status/:id", Authenticated, AdminOnly, updateContactStatus);
router.delete("/:id", Authenticated, AdminOnly, deleteContactQuery);

export default router;

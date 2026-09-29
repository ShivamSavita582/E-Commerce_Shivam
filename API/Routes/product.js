import express from "express";
import {
  addProduct,
  deleteProductById,
  getProduct,
  getProductById,
  updateProductById,
  seedProductsCatalog,
} from "../Controllers/product.js";
import { Authenticated, AdminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Public: view products
router.get("/all", getProduct);
router.get("/:id", getProductById);

// Admin Only: product operations
router.post("/add", Authenticated, AdminOnly, addProduct);
router.post("/seed", Authenticated, AdminOnly, seedProductsCatalog);
router.put("/:id", Authenticated, AdminOnly, updateProductById);
router.delete("/:id", Authenticated, AdminOnly, deleteProductById);

export default router;
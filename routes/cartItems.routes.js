import express from "express";
import {
	addToCart,
	clearCart,
	deleteItem,
	fetchAllItems,
} from "../controllers/cartItems.controllers.js";
import { verifyToken } from "../utils/verifyAuth.js";

const router = express.Router();

router.get("/get-all-items", verifyToken, fetchAllItems);
router.post("/add-to-cart", verifyToken, addToCart);
router.delete("/delete-item/:id", verifyToken, deleteItem);
router.delete("/clear-cart", verifyToken, clearCart);

export default router;

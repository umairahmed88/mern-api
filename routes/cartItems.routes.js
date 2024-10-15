import express from "express";
import {
	addToCart,
	clearCart,
	decreaseItem,
	deleteItem,
	fetchAllItems,
	increaseItem,
	updateItemQuantity,
} from "../controllers/cartItems.controllers.js";
import { verifyToken } from "../utils/verifyAuth.js";

const router = express.Router();

router.get("/get-all-items", verifyToken, fetchAllItems);
router.post("/add-to-cart", verifyToken, addToCart);
router.put("/increase-item/:id", verifyToken, increaseItem);
router.put("/decrease-item/:id", verifyToken, decreaseItem);
router.put("/update-item-quantity/:id", verifyToken, updateItemQuantity);
router.delete("/delete-item/:id", verifyToken, deleteItem);
router.delete("/clear-cart", verifyToken, clearCart);

export default router;

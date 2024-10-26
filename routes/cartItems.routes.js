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
import { verifyToken, verifyUser } from "../utils/verifyAuth.js";

const router = express.Router();

router.get("/get-all-items", verifyToken, verifyUser, fetchAllItems);
router.post("/add-to-cart", verifyToken, verifyUser, addToCart);
router.put("/increase-item/:id", verifyToken, verifyUser, increaseItem);
router.put("/decrease-item/:id", verifyToken, verifyUser, decreaseItem);
router.put(
	"/update-item-quantity/:id",
	verifyToken,
	verifyUser,
	updateItemQuantity
);
router.delete("/delete-item/:id", verifyToken, deleteItem);
router.delete("/clear-cart", verifyToken, verifyUser, clearCart);

export default router;

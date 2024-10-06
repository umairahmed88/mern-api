import express from "express";
import {
	addToCart,
	fetchAllItems,
} from "../controllers/cartItems.controllers.js";
import { verifyToken } from "../utils/verifyAuth.js";

const router = express.Router();

router.get("/get-all-items", verifyToken, fetchAllItems);
router.post("/add-to-cart", verifyToken, addToCart);

export default router;

import express from "express";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyAuth.js";
import {
	createOrder,
	deleteAllOrders,
	deleteOrder,
	fetchAllOrders,
	fetchOneOrder,
	updateOrder,
} from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/create-order", verifyToken, verifyUser, createOrder);
router.put("/update-order/:id", verifyToken, verifyAdmin, updateOrder);
router.get("/get-all", verifyToken, verifyAdmin, fetchAllOrders);
router.get("/get-one/:id", verifyToken, verifyAdmin, fetchOneOrder);
router.delete("/delete-one/:id", verifyToken, verifyAdmin, deleteOrder);
router.delete("/delete-all", verifyToken, verifyAdmin, deleteAllOrders);

export default router;

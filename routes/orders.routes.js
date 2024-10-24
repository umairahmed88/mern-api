import express from "express";
import { verifyToken } from "../utils/verifyAuth.js";
import {
	createOrder,
	deleteAllOrders,
	deleteOrder,
	fetchAllOrders,
	fetchOneOrder,
	updateOrder,
} from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.put("/update-order/:id", verifyToken, updateOrder);
router.get("/get-all", verifyToken, fetchAllOrders);
router.get("/get-one/:id", verifyToken, fetchOneOrder);
router.delete("/delete-one/:id", verifyToken, deleteOrder);
router.delete("/delete-all", verifyToken, deleteAllOrders);

export default router;

import express from "express";
import { verifyToken } from "../utils/verifyAuth.js";
import { createOrder } from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);

export default router;

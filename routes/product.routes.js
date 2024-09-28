import express from "express";
import {
	createProduct,
	getAllProducts,
	getOne,
} from "../controllers/product.controllers.js";
import { verifyToken } from "../utils/verifyAuth.js";

const router = express.Router();

router.post("/create-product", verifyToken, createProduct);
router.get("/get-one-product/:id", getOne);
router.get("/get-all-products", getAllProducts);

export default router;

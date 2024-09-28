import express from "express";
import {
	createProduct,
	getAllProducts,
	getOne,
	updateProduct,
} from "../controllers/product.controllers.js";
import { verifyToken } from "../utils/verifyAuth.js";

const router = express.Router();

router.post("/create-product", verifyToken, createProduct);
router.get("/get-one-product/:id", getOne);
router.get("/get-all-products", getAllProducts);
router.put("/update-product/:id", updateProduct);

export default router;

import express from "express";
import {
	createProduct,
	getAllProducts,
	getOne,
} from "../controllers/product.controllers.js";

const router = express.Router();

router.post("/create-product", createProduct);
router.get("/get-one-product", getOne);
router.get("/get-all-products", getAllProducts);

export default router;

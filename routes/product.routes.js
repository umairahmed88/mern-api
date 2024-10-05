import express from "express";
import {
	createProduct,
	decreaseProduct,
	deleteAllProducts,
	deleteProduct,
	getAllProducts,
	getOne,
	increaseProduct,
	updateProduct,
} from "../controllers/product.controllers.js";
import { verifyToken } from "../utils/verifyAuth.js";

const router = express.Router();

router.post("/create-product", verifyToken, createProduct);
router.get("/get-one-product/:id", getOne);
router.get("/get-all-products", getAllProducts);
router.put("/update-product/:id", verifyToken, updateProduct);
router.put("/increase-product/:id", verifyToken, increaseProduct);
router.put("/decrease-product/:id", verifyToken, decreaseProduct);
router.delete("/delete-product/:id", verifyToken, deleteProduct);
router.delete("/delete-all-products", verifyToken, deleteAllProducts);

export default router;

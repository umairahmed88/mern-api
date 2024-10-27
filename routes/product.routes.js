import express from "express";
import {
	createProduct,
	decreaseProduct,
	deleteAllProducts,
	deleteProduct,
	getAllProducts,
	getOne,
	increaseProduct,
	searchProducts,
	updateProduct,
} from "../controllers/product.controllers.js";
import { verifyAdmin, verifyToken } from "../utils/verifyAuth.js";

const router = express.Router();

router.post("/create-product", verifyToken, verifyAdmin, createProduct);
router.get("/get-one-product/:id", getOne);
router.get("/get-all-products", getAllProducts);
router.put("/update-product/:id", verifyToken, verifyAdmin, updateProduct);
router.put("/increase-product/:id", verifyToken, verifyAdmin, increaseProduct);
router.put("/decrease-product/:id", verifyToken, verifyAdmin, decreaseProduct);
router.delete("/delete-product/:id", verifyToken, verifyAdmin, deleteProduct);
router.delete(
	"/delete-all-products",
	verifyToken,
	verifyAdmin,
	deleteAllProducts
);
router.get("/search", searchProducts);

export default router;

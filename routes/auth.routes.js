import express from "express";
import {
	google,
	signin,
	signout,
	signup,
	updateUser,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../utils/verifyAuth.js";
import { verifyEmail } from "../utils/verifyEmail.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signin-google", google);
router.put("/update-user/:id", verifyToken, updateUser);
router.post("/signout", verifyToken, signout);

router.get("/verify-email", verifyEmail);

export default router;

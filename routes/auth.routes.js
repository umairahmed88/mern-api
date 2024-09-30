import express from "express";
import rateLimit from "express-rate-limit";
import {
	forgotPassword,
	google,
	signin,
	signout,
	signup,
	updateUser,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../utils/verifyAuth.js";
import { verifyEmail } from "../utils/verifyEmail.js";
import { resetPasswordEmail } from "../utils/resetPasswordEmail.js";

const forgotPasswordLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 3,
	message:
		"Too many password reset requests from this email, please try again later.",
});

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signin-google", google);
router.put("/update-user/:id", verifyToken, updateUser);
router.post("/signout", verifyToken, signout);

router.get("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordEmail);

export default router;

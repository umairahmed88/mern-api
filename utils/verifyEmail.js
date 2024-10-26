import { Auth } from "../models/auth.model.js";
import jwt from "jsonwebtoken";

const sanitizeUser = (user) => ({
	id: user._id,
	username: user.username,
	email: user.email,
	avatar: user.avatar,
});

export const verifyEmail = async (req, res) => {
	try {
		const { token } = req.query;

		if (!token) {
			return res.status(400).json("Invalid verification link.");
		}

		// Verify JWT token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const { id, username, email: newEmail, password, avatar } = decoded;

		// Check if user already exists in the database (just in case)
		const existingUser = await Auth.findById(id);
		if (existingUser) {
			// Email update scenario: Update user's email
			if (!existingUser.isVerified || existingUser.email !== newEmail) {
				existingUser.email = newEmail; // Update to new email
				existingUser.isVerified = true; // Mark as verified
				await existingUser.save();

				const sanitizedUser = sanitizeUser(existingUser);
				return res.status(200).json({
					message: "Email updated and verified successfully.",
					user: sanitizedUser,
				});
			} else {
				return res.status(400).json("This email is already verified.");
			}
		} else {
			const newUser = new Auth({
				username,
				email: newEmail, // Use new email from token
				password, // Store hashed password from the token
				avatar,
				isVerified: true, // Mark as verified after signup verification
			});

			// Create and save new user after verification

			await newUser.save();

			const sanitizedUser = sanitizeUser(newUser);

			res.status(200).json({
				message:
					"Email verified successfully! Your account has been created, you can now sign in.",
				sanitizedUser,
			});
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

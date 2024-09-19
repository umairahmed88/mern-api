import Auth from "../models/auth.model.js";
import jwt from "jsonwebtoken";

export const verifyEmail = async (req, res) => {
	try {
		const { token } = req.query;

		if (!token) {
			return res.status(400).json("Invalid verification link.");
		}

		// Verify JWT token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const { username, email, password, avatar } = decoded;

		// Check if user already exists in the database (just in case)
		const isUser = await Auth.findOne({ email });
		if (isUser) {
			return res.status(400).json("User already exists or has been verified.");
		}

		// Create and save new user after verification
		const newUser = new Auth({
			username,
			email,
			password,
			avatar,
			isVerified: true, // Set the user as verified
		});

		await newUser.save();

		res.status(200).json({
			message:
				"Email verified successfully! Your account has been created, you can now sign in.",
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

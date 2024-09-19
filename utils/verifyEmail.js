import Auth from "../models/auth.model.js";
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

		const { username, email, password, avatar } = decoded;

		// Check if user already exists in the database (just in case)
		const existingUser = await Auth.findOne({ email });
		if (existingUser) {
			if (existingUser.isVerified) {
				return res.status(400).json("This email is already verified.");
			}

			existingUser.isVerified = true;
			await existingUser.save();

			const sanitizedUser = sanitizeUser(existingUser);

			return res
				.status(200)
				.json({ message: "Email updated and verified.", sanitizedUser });
		}

		// Create and save new user after verification
		const newUser = new Auth({
			username,
			email,
			password,
			avatar,
			isVerified: true,
		});

		await newUser.save();

		const sanitizedUser = sanitizeUser(newUser);

		res.status(200).json({
			message:
				"Email verified successfully! Your account has been created, you can now sign in.",
			sanitizedUser,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

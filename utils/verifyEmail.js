import Auth from "../models/auth.model.js";
import jwt from "jsonwebtoken";

export const verifyEmail = async (req, res) => {
	const { token } = req.query;

	if (!token) {
		return res.status(400).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { email, username, password, avatar } = decoded;

		let user = await Auth.findOne({ email });

		if (user) {
			// Email already verified or user exists with the new email
			if (user.email === email) {
				return res.status(400).json({ message: "Email already verified" });
			}

			const sanitizedUser = new Auth({
				username,
				email,
				password,
				avatar,
			});

			await sanitizedUser.save();
			return res.redirect(`${process.env.CLIENT_URL}/signup`);
		}

		const sanitizedUser = new Auth(decoded);

		await sanitizedUser.save();

		res.redirect(`${process.env.CLIENT_URL}/signup`);
	} catch (error) {
		console.error("Error in verifyEmail:", error.message);
		res.status(400).json({ message: error.message });
	}
};

// import Auth from "../models/auth.model.js";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const verifyEmail = async (req, res) => {
// 	try {
// 		const { token } = req.query;

// 		if (!token) {
// 			return res.status(400).json("Invalid verification link.");
// 		}

// 		// Verify JWT token
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 		const { username, email, password, avatar } = decoded;

// 		// Check if user already exists in the database (just in case)
// 		const isUser = await Auth.findOne({ email });
// 		if (isUser) {
// 			return res.status(400).json("User already exists or has been verified.");
// 		}

// 		// Hash the password before saving the user
// 		const hashedPassword = bcryptjs.hashSync(password, 10);

// 		// Create and save new user after verification
// 		const newUser = new Auth({
// 			username,
// 			email,
// 			password: hashedPassword,
// 			avatar,
// 			isVerified: true, // Set the user as verified
// 		});

// 		await newUser.save();

// 		res.status(200).json({
// 			message:
// 				"Email verified successfully! Your account has been created, you can now sign in.",
// 		});
// 	} catch (err) {
// 		res.status(500).json({ message: err.message });
// 	}
// };

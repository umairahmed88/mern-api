import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";

export const verifyEmail = async (req, res) => {
	const { token } = req.query;

	if (!token) {
		res.status(400).json({ message: "no token provided" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const { email, username, password, avatar } = decoded;

		let user = await Auth.findOne({ email });

		if (user) {
			if (user.email === email) {
				return res.status(400).json({ message: "Email already verified" });
			}

			const sanitizedUser = new Auth({
				username,
				email,
				password,
				avatar: avatar,
			});

			await sanitizedUser.save();
			return res.redirect(`${process.env.CLIENT_URL}/signin`);
		}

		const sanitizedUser = new Auth({ ...decoded, avatar });

		await sanitizedUser.save();

		res.redirect(`${process.env.CLIENT_URL}/signin`);
	} catch (err) {
		console.error("Error verifying email: ", err.message);
		res.status(400).json({ message: err.message });
	}
};

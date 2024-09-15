import Auth from "../models/auth.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const sanitizeUser = (user) => ({
	id: user._id,
	username: user.username,
	email: user.email,
	avatar: user.avatar,
});

export const signup = async (req, res) => {
	try {
		const { username, email, password, confirmPassword, avatar } = req.body;

		const isUser = await Auth.findOne({ email });
		if (isUser) {
			return res.status(400).json({
				message:
					"User with this email already signed up. Please signup with other email.",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match." });
		}

		const hashedPassword = bcryptjs.hashSync(password, 10);

		const newUser = new Auth({
			username,
			email,
			password: hashedPassword,
			avatar,
		});

		await newUser.save();

		const sanitizedUser = sanitizeUser(newUser);

		res.status(200).json({ message: "Signup Successful", sanitizedUser });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const signin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await Auth.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isValidPassword = bcryptjs.compareSync(password, user.password);
		if (!isValidPassword) {
			return res.status(403).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const sanitizedUser = {
			...sanitizeUser(user),
			token,
		};

		res.status(200).json({ message: "Login Successful", sanitizedUser });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const google = async (req, res) => {
	try {
		const { email, name, avatar } = req.body;

		const user = await Auth.findOne({ email });

		if (user) {
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			const sanitizedUser = {
				...sanitizeUser(user),
				token,
			};
			return res
				.status(200)
				.json({ message: "singed in with google", sanitizedUser });
		} else {
			const generatedPassword =
				Math.random().toString(36).slice(-8) +
				Math.random().toString(36).slice(-8);

			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

			const newUser = new Auth({
				username: name,
				email: email,
				password: hashedPassword,
				avatar: avatar,
			});

			await newUser.save();

			const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
			});

			const sanitizedUser = {
				...sanitizeUser(newUser),
				token,
			};

			return res
				.status(200)
				.json({ message: "signed up with google", sanitizedUser });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;

		const { username, email: newEmail, password, avatar } = req.body;

		const user = await Auth.findById(id);
		if (!user) {
			return res.status(404).json({ message: "Please login first." });
		}

		if (newEmail && newEmail !== user.email) {
			const existingUser = await Auth.findOne({ email: newEmail });
			if (existingUser) {
				return res.status(400).json({
					message: `Email ${newEmail} is already signed up, try another email.`,
				});
			}
		}

		if (password) {
			req.body.password = bcryptjs.hashSync(password, 10);
		}

		const updatedUser = await Auth.findByIdAndUpdate(
			id,
			{ $set: req.body },
			{ new: true }
		);

		const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const sanitizedUser = {
			...sanitizeUser(updatedUser),
			token,
		};

		res.status(200).json({ message: "Profile updated", sanitizedUser });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const signout = async (req, res) => {
	try {
		res.status(200).json({ message: "signed out" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

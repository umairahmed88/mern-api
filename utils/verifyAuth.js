import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(401).json({ message: "Login to proceed." });
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET,
			(err, decoded) => {
				if (err) {
					if (err.name === "TokenExpiredError") {
						return res.status(401).json({
							message: "Please login first.",
						});
					}

					res.status(500).json({ message: err.message });
				}

				req.user = decoded;
				next();
			}
		);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const verifyConsumer = (req, res, next) => {
	if (req.user.role !== "user") {
		return res.status(403).json({ message: "Forbidden! Users only." });
	}
	next();
};

export const verifyAdmin = (req, res, next) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ message: "Forbidden! Admins only." });
	}
	next();
};

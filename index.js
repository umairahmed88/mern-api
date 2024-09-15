import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to MongoDB!");
	})
	.catch((err) => console.log("Error connecting to Mongo: ", err));

app.use(express.json());

const corsOptions = {
	origin: (origin, callback) => {
		const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
	res.send("API is running");
});

app.listen(process.env.DEV_PORT, () => {
	console.log(`Listening on port ${process.env.DEV_PORT}`);
});

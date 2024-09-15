import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";

const app = express();

const isProduction = process.env.PROD_PORT === "production";

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to MongoDB!");
	})
	.catch((err) => console.log("Error connecting to Mongo: ", err));

app.use(express.json());

const corsOptions = {
	origin: isProduction
		? process.env.CLIENT_URL
		: ["http://localhost:5173", process.env.CLIENT_URL],
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	Credentials: true,
};

app.use(cors(corsOptions));
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
	res.send("API is running");
});

app.listen(process.env.DEV_PORT, () => {
	console.log(`Listening on port ${process.env.DEV_PORT}`);
});

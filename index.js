import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";

const app = express();

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to MongoDB!");
	})
	.catch((err) => console.log("Error connecting to Mongo: ", err));

app.use(
	cors({
		origin: ["https://mern-client-ua.vercel.app"],
		credentials: true,
	})
);
app.use(express.json());
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
	res.send("API is running");
});

app.listen(process.env.DEV_PORT, () => {
	console.log(`Listening on port ${process.env.DEV_PORT}`);
});

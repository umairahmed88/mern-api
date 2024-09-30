import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
	token: { type: String, required: true, unique: true },
	createdAt: { type: Date, default: Date.now, expires: 1200 },
});

const Token = mongoose.model("mernTokenTwo", tokenSchema);
export default Token;

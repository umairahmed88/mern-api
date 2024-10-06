import mongoose from "mongoose";

const CartItemsSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "authMernTwo",
			required: true,
		},
		name: { type: String },
		description: { type: String },
		price: { type: Number },
		category: { type: String },
		availableStock: { type: Number },
		discount: { type: Number },
		brand: { type: String },
		manufacturerPartNumber: { type: String },
		countryOfOrigin: { type: String },
		imageUrls: [{ type: String }],
		quantity: { type: Number },
		specifications: [
			{
				size: String,
				color: String,
				material: String,
				weight: Number,
				dimensions: String,
				warrantyPeriod: String,
			},
		],
		reviews: [
			{
				customerId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "authMernTwo",
				},
				rating: Number,
				comment: String,
				datePosted: {
					type: Date,
					default: Date.now,
				},
			},
		],
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "productsMernTwo",
			required: true,
		},
	},
	{ timestamps: true }
);

const CartItems = mongoose.model("cartMernTwo", CartItemsSchema);

export default CartItems;

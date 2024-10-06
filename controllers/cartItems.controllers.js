import CartItems from "../models/cartItems.models.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity = 1 } = req.body;

		const userId = req.user.id;

		if (!userId) {
			res.status(401).json({
				message: "Please login or signup for shopping.",
			});
		}

		const product = await Product.findById(productId);

		if (!product) {
			return res.status(404).json({ message: "No such product." });
		}

		let cartItem = await CartItems.findOne({ userId, productId });

		if (cartItem) {
			cartItem.quantity += quantity;
			await cartItem.save();
		} else {
			cartItem = await CartItems({
				userId,
				productId,
				name: product.name,
				description: product.description,
				price: product.price,
				category: product.category,
				quantity: quantity,
				discount: product.discount,
				brand: product.brand,
				manufacturerPartNumber: product.manufacturerPartNumber,
				countryOfOrigin: product.countryOfOrigin,
				imageUrls: product.imageUrls,
				specifications: product.specifications,
				reviews: product.reviews,
			});

			await CartItems.save();
		}

		product.quantity -= quantity;
		await product.save();

		return res
			.status(200)
			.json({ message: `${product.name} is added to cart`, cartItem });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const fetchAllItems = async (req, res) => {
	try {
		const items = await CartItems.find({});
		const totalItems = items.length;

		return items
			? res.status(200).json({
					message:
						totalItems.length === 1
							? `You have ${totalItems} item in your cart.`
							: `There are ${totalItems} items in your cart.`,
					items,
			  })
			: res.status(404).json({ message: "Your cart is empty." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

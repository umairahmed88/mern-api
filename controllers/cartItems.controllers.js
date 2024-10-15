import CartItems from "../models/cartItems.models.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity = 1 } = req.body;

		const userId = req.user.id;

		if (!userId) {
			return res.status(401).json({
				message: "Please login or signup for shopping.",
			});
		}

		const product = await Product.findById(productId);

		if (!product) {
			return res.status(404).json({ message: "No such product." });
		}

		if (product.quantity < quantity) {
			return res.status(400).json({
				message: `Insufficient stock. Only ${product.quantity} items available.`,
			});
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

			await cartItem.save();
		}

		product.quantity -= quantity;
		await product.save();

		return res
			.status(200)
			.json({ message: `${product.name} is added to cart`, cartItem });
	} catch (err) {
		if (err.message.includes("Insufficient stock")) {
			return res.status(400).json({ message: err.message });
		}

		return res
			.status(500)
			.json({ message: "Something went wrong. Please try again." });
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

export const increaseItem = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!userId) {
			return res.status(401).json({
				message: "Please login or signup for shopping.",
			});
		}
		const item = await CartItems.findById(req.params.id);

		if (!item) {
			return res
				.status(404)
				.json({ message: "There is no such item in your cart." });
		}

		const product = await Product.findById(item.productId);

		if (!product) {
			return res.status(404).json({ message: "Product Not Found" });
		}

		if (product.quantity <= 0) {
			return res.status(404).json({ message: "Item not available." });
		}

		product.quantity--;
		item.quantity++;
		item.availableStock = product.quantity;
		await product.save();
		await item.save();

		return res
			.status(200)
			.json({ message: `The quantity of ${item.name} is increased`, item });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const decreaseItem = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!userId) {
			return res.status(401).json({
				message: "Please login or signup for shopping.",
			});
		}
		const item = await CartItems.findById(req.params.id);

		if (!item) {
			return res
				.status(404)
				.json({ message: "There is no such item in your cart." });
		}

		const product = await Product.findById(item.productId);

		if (!product) {
			return res.status(404).json({ message: "Product Not Found" });
		}

		item.quantity--;
		product.quantity++;

		await product.save();

		if (item.quantity === 0) {
			await item.deleteOne();

			return res.status(200).json({ message: "Item removed from the cart." });
		} else {
			item.availableStock = product.quantity;
			await item.save();

			return res
				.status(200)
				.json({ message: `The quantity of ${item.name} is decreased`, item });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteItem = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!userId) {
			return res.status(401).json({
				message: "Please login or signup for shopping.",
			});
		}

		const item = await CartItems.findById(req.params.id);

		if (!item) {
			return res
				.status(404)
				.json({ message: "There is no such item in your cart." });
		}

		const product = await Product.findById(item.productId);

		if (!product) {
			return res.status(404).json({ message: "Product Not Found" });
		}

		product.quantity += item.quantity;
		await CartItems.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Item is deleted from your cart." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const clearCart = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!userId) {
			return res.status(401).json({
				message: "Please login or signup for shopping.",
			});
		}

		const items = await CartItems.find({});
		let totalQuantity = 0;

		for (const item of items) {
			const product = await Product.findById(item.productId);

			if (!product) {
				continue;
			}

			totalQuantity += item.quantity;
			product.quantity += item.quantity;
			await product.save();
		}

		await CartItems.deleteMany();

		res
			.status(200)
			.json({ message: "Your cart has been cleared. Continue shopping." });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

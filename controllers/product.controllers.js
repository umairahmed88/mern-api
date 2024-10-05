import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
	try {
		const product = await Product.create(req.body);

		return res.status(201).json({ message: "Product created", product });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getOne = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		return product
			? res.status(200).json(product)
			: res.status(404).json({ message: `${product.name} not available` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		const totalProducts = products.length;

		return products.length > 0
			? res.status(200).json({
					message:
						totalProducts === 1
							? `There is ${totalProducts} product available`
							: `There are ${totalProducts} products available`,
					products,
			  })
			: res
					.status(200)
					.json({ message: "There are no products available", products: [] });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});

		return product
			? res
					.status(200)
					.json({ message: `Product ${product.name} updated`, product })
			: res.status(200).json({ message: `${product.name} is not available` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const increaseProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		const totalUnits = product.quantity;

		return product
			? (product.quantity++,
			  await product.save(),
			  res.status(200).json({
					message: `Quantity of ${product.name} is increased, there are ${totalUnits} available`,
					product,
			  }))
			: res.status(404).json({ message: "No such product" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const decreaseProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		const totalUnits = product.quantity;

		return product.quantity > 0
			? (product.quantity--,
			  await product.save(),
			  res.status(200).json({
					message: `Quantity of ${product.name} is increased, there are ${totalUnits} of ${product.name} available`,
					product,
			  }))
			: res.status(404).json({ message: "No such product" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		return res.status(200).json({ message: "Product deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteAllProducts = async (req, res) => {
	try {
		await Product.deleteMany();

		return res
			.status(200)
			.json({ message: "All Products deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

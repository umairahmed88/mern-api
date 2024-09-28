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
			: res.status(404).json({ message: "Product is not available" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		const totalProducts = products.length;

		return products
			? res.status(200).json({
					message:
						totalProducts === 1
							? `There is ${totalProducts} product available`
							: `There are ${totalProducts} available`,
					products,
			  })
			: res.status(404).json({ message: "There is no available product" });
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
			: res.status(404).json({ message: `${product.name} not found` });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

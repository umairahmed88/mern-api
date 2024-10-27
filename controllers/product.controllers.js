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

		return products.length > 0
			? res.status(200).json({
					message:
						products.length === 1
							? `There is ${products.length} product available`
							: `There are ${products.length} products available`,
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

		return product
			? (product.quantity++,
			  await product.save(),
			  res.status(200).json({
					message: `Quantity of ${product.name} is increased, there are ${product.quantity} available`,
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

		return product.quantity > 0
			? (product.quantity--,
			  await product.save(),
			  res.status(200).json({
					message: `Quantity of ${product.name} is decreased, there are ${product.quantity} of ${product.name} available`,
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

export const searchProducts = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 10;
		const startIndex = parseInt(req.query.startIndex) || 0;
		const searchTerm = req.query.searchTerm || "";
		const sort = req.query.sort || "averageReviewScore";
		const order = req.query.order === "asc" ? 1 : -1;

		const filters = {};

		if (searchTerm) {
			filters.$or = [
				{ name: { $regex: searchTerm, $options: "i" } },
				{ description: { $regex: searchTerm, $options: "i" } },
			];
		}

		if (req.query.category) {
			filters.category = { $regex: req.query.category, $options: "i" };
		}

		if (req.query.brand) {
			filters.brand = { $regex: req.query.brand, $options: "i" };
		}

		if (req.query.discount) {
			filters.discount = { $gte: parseFloat(req.query.discount) };
		}

		if (req.query.countryOfOrigin) {
			filters.countryOfOrigin = req.query.countryOfOrigin;
		}

		if (req.query.specifications) {
			filters.specifications = { $elemMatch: req.query.specifications };
		}

		if (req.query.review) {
			filters.reviews = { $exists: true };
		}

		const aggregationPipeline = [
			{ $match: filters },
			{
				$lookup: {
					from: "reviewsMernTwo",
					localField: "reviews",
					foreignField: "_id",
					as: "reviews",
				},
			},
			{
				$addFields: {
					averageReviewScore: {
						$ifNull: [{ $avg: "$reviews.rating" }, 0],
					},
				},
			},
			{ $sort: { [sort]: order } },
			{ $skip: startIndex },
			{ $limit: limit },
		];

		const products = await Product.aggregate(aggregationPipeline);

		const totalCounts = await Product.aggregate([
			{ $match: filters },
			{
				$facet: {
					totalBrandCount: [
						{
							$match: {
								brand: { $regex: req.query.brand || "", $options: "i" },
							},
						},
						{ $count: "count" },
					],
					totalCategoryCount: [
						{
							$match: {
								category: { $regex: req.query.category || "", $options: "i" },
							},
						},
						{ $count: "count" },
					],
					totalSearchCount: [
						{
							$match: {
								$or: [
									{ name: { $regex: searchTerm, $options: "i" } },
									{ description: { $regex: searchTerm, $options: "i" } },
								],
							},
						},
						{ $count: "count" },
					],
					totalDiscountCount: [
						{
							$match: {
								discount: { $gte: parseFloat(req.query.discount) || 0 },
							},
						},
						{ $count: "count" },
					],
					totalCountryCount: [
						{ $match: { countryOfOrigin: req.query.countryOfOrigin || "" } },
						{ $count: "count" },
					],
					totalSpecificationCount: [
						{
							$match: {
								specifications: { $elemMatch: req.query.specifications || {} },
							},
						},
						{ $count: "count" },
					],
				},
			},
		]);

		const messageParts = ["Search results:"];
		const counts = totalCounts[0];
		if (counts.totalBrandCount.length)
			messageParts.push(
				`Found ${counts.totalBrandCount[0].count} products for the brand "${req.query.brand}".`
			);
		if (counts.totalCategoryCount.length)
			messageParts.push(
				`Found ${counts.totalCategoryCount[0].count} products in the category "${req.query.category}".`
			);
		if (counts.totalSearchCount.length)
			messageParts.push(
				`Found ${counts.totalSearchCount[0].count} products matching the search term "${searchTerm}".`
			);
		if (counts.totalDiscountCount.length)
			messageParts.push(
				`Found ${counts.totalDiscountCount[0].count} products with a discount of at least ${req.query.discount}%.`
			);
		if (counts.totalCountryCount.length)
			messageParts.push(
				`Found ${counts.totalCountryCount[0].count} products from "${req.query.countryOfOrigin}".`
			);
		if (counts.totalSpecificationCount.length)
			messageParts.push(
				`Found ${counts.totalSpecificationCount[0].count} products matching the specified criteria.`
			);

		const message = messageParts.join(" ");

		return res.status(200).json({ message, products });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

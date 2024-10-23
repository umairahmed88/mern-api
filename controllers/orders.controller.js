import CartItems from "../models/cartItems.models.js";
import Order from "../models/orders.model.js";
import stripe from "stripe";

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
	try {
		const userId = req.user.id;
		if (!userId) {
			return res.status(401).json({
				message: "Please login or signup for shopping.",
			});
		}

		const cartItems = await CartItems.find({ userId });
		if (!cartItems || cartItems.length === 0) {
			return res.status(404).json({ message: "Your cart is empty" });
		}

		const calculateTotalAmount = (items) => {
			return items.reduce((total, item) => {
				const discount = item.discount || 0;
				const itemTotal = item.price * item.quantity * (1 - discount / 100);
				return total + itemTotal;
			}, 0);
		};

		const totalAmount = calculateTotalAmount(cartItems);

		const order = new Order({
			userId,
			totalAmount,
			orderStatus: req.body.orderStatus || "Pending",
			shippingAddress: req.body.shippingAddress,
			billingAddress: req.body.billingAddress,
			contactNum: req.body.contactNum,
			altConNum: req.body.altConNum,
			paymentMethod: req.body.paymentMethod,
			paymentStatus: req.body.paymentStatus || "Pending",
			cartItems: cartItems.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
			})),
		});

		let responsePayload = {
			message: "Order created",
			orderSummary: {
				orderId: order._id,
				totalAmount: order.totalAmount,
				orderStatus: order.orderStatus,
				shippingAddress: order.shippingAddress,
				billingAddress: order.billingAddress,
				contactNum: order.contactNum,
				altConNum: order.altConNum,
				paymentMethod: order.paymentMethod,
				paymentStatus: order.paymentStatus,
				cartItems: cartItems,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
			},
		};

		if (order.paymentMethod === "COD") {
			order.orderStatus = "Confirmed";
			order.paymentStatus = "COD";
			await order.save();
			await CartItems.deleteMany({ userId });

			return res.status(201).json(responsePayload);
		} else if (order.paymentMethod === "Stripe") {
			const session = await stripeInstance.checkout.sessions.create({
				payment_method_types: ["card"],
				line_items: cartItems.map((item) => ({
					price_data: {
						currency: "usd",
						product_data: {
							name: item.name,
						},
						unit_amount: item.price * 100,
					},
					quantity: item.quantity,
				})),

				mode: "payment",
				success_url: `${process.env.CLIENT_URL}/checkout-success?order_id=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${process.env.CLIENT_URL}/cart`,
			});

			order.orderStatus = "Confirmed";
			order.paymentStatus = "Paid";
			await order.save();

			responsePayload.paymentUrl = session.url;
			await CartItems.deleteMany({ userId });

			return res.status(201).json(responsePayload);
		} else {
			return res.status(400).json({ message: "Invalid payment method" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

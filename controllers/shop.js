const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");

exports.getProducts = (req, res, next) => {
	console.log("In the Shop Products directory");
	Product.find()
		.then(products => {
			res.render("shop/product-list", {
				prods: products,
				docTitle: "All Products",
				path: "/products"
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	console.log("Inside the shop product details page , Product id = " + prodId);
	Product.findById(prodId)
		.then(product => {
			res.render("shop/product-detail", {
				product: product,
				docTitle: product.title,
				path: "/product"
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.getIndex = (req, res, next) => {
	console.log("In the Shop Index directory");
	Product.find()
		.then(products => {
			res.render("shop/index", {
				prods: products,
				docTitle: "Shop",
				path: "/"
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.getCart = (req, res, next) => {
	console.log("In the Shop Cart directory");

	req.user
		.populate("cart.items.productId")
		.execPopulate()
		.then(user => {
			console.log(user.cart.items);
			const cartProducts = user.cart.items;
			console.log(cartProducts);
			res.render("shop/cart", {
				products: cartProducts,
				docTitle: "Your Cart",
				path: "/cart"
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.getOrders = (req, res, next) => {
	console.log("In the Shop Orders directory");
	Order.find({ "user.userId": req.user._id })
		.then(orders => {
			console.log(orders);
			res.render("shop/orders", {
				docTitle: "Your Orders",
				path: "/orders",
				orders: orders
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.getCheckout = (req, res, next) => {
	console.log("In the Shop Checkout directory");
	Product.fetchAll(products => {
		res.render("shop/checkout", {
			prods: products,
			docTitle: "Checkout",
			path: "/checkout"
		});
	});
};

exports.getInvoice = (req, res, next) => {
	console.log("In the Get Invoice");
	const orderId = req.params.orderId;
	console.log("Invoice OrderId" + orderId);

	Order.findById(orderId)
		.then(order => {
			if (!order) {
				return next(new Error("No Order Found"));
			}
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error("Unauthorized"));
			}

			const invoiceName = "invoice-" + orderId + ".pdf";
			const invoicePath = path.join("data", "invoices", invoiceName);
			fs.readFile(invoicePath, (err, data) => {
				if (err) {
					console.log(err);
					return next(err);
				}
				console.log("Invoice found successfully");
				res.setHeader("Content-Type", "application/pdf");
				res.setHeader(
					"Content-Disposition",
					"attachment; filename = " + invoiceName + " "
				);
				res.send(data);
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postCart = (req, res, next) => {
	console.log("In the Shop Post Cart directory");
	console.log("product id " + req.body.productId);
	Product.findById(req.body.productId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			//console.log(result);
			res.redirect("/cart");
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postDeleteProductFromCart = (req, res, next) => {
	console.log("In the Shop Post Delete Product directory");
	const id = req.body.id;
	// TODO: Add price
	const price = req.body.price;

	req.user
		.deleteFromCart(id)
		.then(result => {
			res.redirect("/cart");
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postOrder = (req, res, next) => {
	console.log("In the Shop post Order directory");
	req.user
		.populate("cart.items.productId")
		.execPopulate()
		.then(user => {
			console.log(user.cart.items);
			const products = user.cart.items.map(i => {
				return { quantity: i.quantity, product: { ...i.productId._doc } };
			});

			const order = new Order({
				products: products,
				user: {
					userId: req.user._id
				}
			});
			console.log(order);
			return order.save();
		})
		.then(result => {
			req.user.cart.items = [];
			return req.user.save();
		})
		.then(result => {
			console.log("post order Successfully");
			res.redirect("/orders");
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

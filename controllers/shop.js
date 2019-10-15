const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");
const secrets = require("../secrets");
const stripe = require("stripe")(secrets.stripeSecretKey);
const itemPerPage = 2;

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
	let page = +req.query.page || 1;
	let totalProducts;

	Product.find()
		.countDocuments()
		.then(numOfProducts => {
			totalProducts = numOfProducts;
			return Product.find()
				.skip((page - 1) * itemPerPage)
				.limit(itemPerPage);
		})
		.then(products => {
			res.render("shop/index", {
				prods: products,
				docTitle: "Shop",
				path: "/",
				currentPage: page,
				hasNextPage: page * itemPerPage < totalProducts,
				hasPreviousPage: page > 1,
				nextPage: page + 1,
				previousPage: page - 1,
				lastPage: Math.ceil(totalProducts / itemPerPage)
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

	req.user
		.populate("cart.items.productId")
		.execPopulate()
		.then(user => {
			//console.log(user.cart.items);
			const cartProducts = user.cart.items;
			//console.log(cartProducts);
			let totalSum = 0;
			cartProducts.forEach(p => {
				console.log(p);
				totalSum += p.quantity * p.productId.price;
			});
			console.log("TotalSum: " + totalSum.toString());
			res.render("shop/checkout", {
				products: cartProducts,
				totalSum: totalSum,
				publishableKey: secrets.stripePublishableKey,
				docTitle: "Checkout",
				path: "/checkout"
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
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

			const pdfDoc = new pdfDocument();
			pdfDoc.pipe(fs.createWriteStream(invoicePath));
			pdfDoc.pipe(res);

			pdfDoc.fontSize(26).text("Invoice");
			pdfDoc.text("---------------------------");

			let totalPrice = 0;
			order.products.forEach(prod => {
				pdfDoc
					.fontSize(16)
					.text(
						prod.product.title +
							" - " +
							prod.quantity.toString() +
							"x - " +
							prod.product.price.toString() +
							" teka"
					);
				totalPrice += prod.quantity * prod.product.price;
			});
			pdfDoc.fontSize(26).text("---------------------------");
			pdfDoc.text("Total Price: " + totalPrice + " teka");

			pdfDoc.end();
			// const file = fs.createReadStream(invoicePath);
			// file.on("error", () => {
			// 	return next(new Error("File Not Found"));
			// });
			console.log("Invoice Generated successfully");
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposition",
				"attachment; filename = " + invoiceName + " "
			);
			// file.pipe(res);
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

	const token = req.body.stripeToken;
	console.log(token);
	let totalSum = 0;

	req.user
		.populate("cart.items.productId")
		.execPopulate()
		.then(user => {
			user.cart.items.forEach(p => {
				totalSum += p.quantity * p.productId.price;
			});
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
			const charge = stripe.charges.create(
				{
					amount: totalSum * 100,
					currency: "usd",
					source: token,
					description: "Demo Order gg",
					metadata: { order_id: result._id.toString() }
				},
				function(err, charge) {
                    //TODO: Check if success then add to orders
					console.log(err);
					console.log(charge);
				}
			);
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

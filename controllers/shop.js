const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
	console.log("In the Shop Products directory");
	Product.find()
		.then(products => {
			res.render("shop/product-list", {
				prods: products,
				docTitle: "All Products",
				path: "/products",
				isLoggedIn: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	console.log("Inside the shop product details page , Product id = " + prodId);
	Product.findById(prodId)
		.then(product => {
			res.render("shop/product-detail", {
				product: product,
				docTitle: product.title,
				path: "/product",
				isLoggedIn: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
	console.log("In the Shop Index directory");
	Product.find()
		.then(products => {
			res.render("shop/index", {
				prods: products,
				docTitle: "Shop",
				path: "/",
				isLoggedIn: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
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
				path: "/cart",
				isLoggedIn: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
	console.log("In the Shop Orders directory");
	Order.find({ "user.userId": req.user._id })
		.then(orders => {
			console.log(orders);
			res.render("shop/orders", {
				docTitle: "Your Orders",
				path: "/orders",
				orders: orders,
				isLoggedIn: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
	console.log("In the Shop Checkout directory");
	Product.fetchAll(products => {
		res.render("shop/checkout", {
			prods: products,
			docTitle: "Checkout",
			path: "/checkout",
			isLoggedIn: req.session.isLoggedIn
		});
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
		.catch(err => console.log(err));
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
		.catch(err => console.log(err));
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
					userId: req.user._id,
					name: req.user.name
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
		.catch(err => console.log(err));
};

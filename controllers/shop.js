const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
	console.log("In the Shop Products directory");
	Product.fetchAll(products => {
		res.render("shop/product-list", {
			prods: products,
			docTitle: "All Products",
			path: "/products"
		});
	});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	console.log("Inside the shop product details page , Product id = " + prodId);
	Product.findById(prodId, product => {
		res.render("shop/product-detail", {
			product: product,
			docTitle: product.title,
			path: "/products"
		});
	});
};

exports.getIndex = (req, res, next) => {
	console.log("In the Shop Index directory");
	Product.fetchAll(products => {
		res.render("shop/index", {
			prods: products,
			docTitle: "Shop",
			path: "/"
		});
	});
};

exports.getCart = (req, res, next) => {
	console.log("In the Shop Cart directory");
	Product.fetchAll(products => {
		res.render("shop/cart", {
			prods: products,
			docTitle: "Your Cart",
			path: "/cart"
		});
	});
};

exports.getOrders = (req, res, next) => {
	console.log("In the Shop Orders directory");
	Product.fetchAll(products => {
		res.render("shop/orders", {
			prods: products,
			docTitle: "Your Orders",
			path: "/orders"
		});
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

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	Product.findById(productId, product => {
        console.log(product);
        Cart.addProduct(product.id,product.price)
		res.redirect("/cart");
	});
};

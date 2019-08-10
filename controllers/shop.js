const Product = require("../models/product");

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

exports.getCheckout = (req, res, next) => {
	console.log("In the Shop Cart directory");
	Product.fetchAll(products => {
		res.render("shop/checkout", {
			prods: products,
			docTitle: "Checkout",
			path: "/checkout"
		});
	});
};
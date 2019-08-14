const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
	console.log("In the Shop Products directory");
	Product.fetchAll()
		.then(([products]) => {
			res.render("shop/product-list", {
				prods: products,
				docTitle: "All Products",
				path: "/products"
			});
		})
		.catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	console.log("Inside the shop product details page , Product id = " + prodId);
	Product.findById(prodId)
		.then(([product]) => {
			res.render("shop/product-detail", {
				product: product[0],
				docTitle: product[0].title,
				path: "/product"
			});
		})
		.catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
	console.log("In the Shop Index directory");
	Product.fetchAll()
		.then(([products]) => {
			res.render("shop/index", {
				prods: products,
				docTitle: "Shop",
				path: "/"
			});
		})
		.catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
	console.log("In the Shop Cart directory");
	Cart.getCart(cart => {
		Product.fetchAll(products => {
			const cartProducts = [];
			for (product of products) {
				const cartProductData = cart.products.find(
					prod => prod.id == product.id
				);
				if (cartProductData) {
					cartProducts.push({
						productData: product,
						quantity: cartProductData.quantity
					});
				}
			}
			cartProducts.totalPrice = cart.totalPrice;

			res.render("shop/cart", {
				products: cartProducts,
				docTitle: "Your Cart",
				path: "/cart"
			});
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
		Cart.addProduct(product.id, product.price);
		res.redirect("/cart");
	});
};

exports.postDeleteProdcutFromCart = (req, res, next) => {
	const id = req.body.id;
	const price = req.body.price;
	Cart.deleteProduct(id, price);
	res.redirect("/cart");
};

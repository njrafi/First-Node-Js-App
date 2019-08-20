const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
	console.log("In the Shop Products directory");
	Product.fetchAll()
		.then(products => {
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
		.then(product => {
			res.render("shop/product-detail", {
				product: product,
				docTitle: product.title,
				path: "/product"
			});
		})
		.catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
	console.log("In the Shop Index directory");
	Product.fetchAll()
		.then(products => {
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

	req.user
		.getCart()
		.then(cart => {
			return cart
				.getProducts()
				.then(cartProducts => {
					console.log(cartProducts);
					res.render("shop/cart", {
						products: cartProducts,
						docTitle: "Your Cart",
						path: "/cart"
					});
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
	console.log("In the Shop Orders directory");
	req.user
		.getOrders({ include: ["products"] })
		.then(orders => {
			res.render("shop/orders", {
				docTitle: "Your Orders",
				path: "/orders",
				orders: orders
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
			path: "/checkout"
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
			//res.redirect("/cart");
		})
		.catch(err => console.log(err));
	// const productId = req.body.productId;
	// let fetchedCart;
	// let newQuantity = 1;
	// req.user
	// 	.getCart()
	// 	.then(cart => {
	// 		fetchedCart = cart;
	// 		return cart.getProducts({ where: { id: productId } });
	// 	})
	// 	.then(products => {
	// 		let product;
	// 		if (products.length > 0) {
	// 			product = products[0];
	// 		}
	// 		if (product) {
	// 			const oldQuantity = product.cartItem.quantity;
	// 			newQuantity = oldQuantity + 1;
	// 			return product;
	// 		}
	// 		return Product.findByPk(productId);
	// 	})
	// 	.then(product => {
	// 		return fetchedCart.addProduct(product, {
	// 			through: { quantity: newQuantity }
	// 		});
	// 	})
	// 	.then(() => {
	// 		res.redirect("/cart");
	// 	})
	// 	.catch(err => console.log(err));
};

exports.postDeleteProductFromCart = (req, res, next) => {
	console.log("In the Shop Post Delete Product directory");
	const id = req.body.id;
	const price = req.body.price;

	req.user
		.getCart()
		.then(cart => {
			return cart.getProducts({ where: { id: id } });
		})
		.then(products => {
			const product = products[0];
			return product.cartItem.destroy();
		})
		.then(result => {
			res.redirect("/cart");
		})
		.catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
	console.log("In the Shop post Order directory");
	let fetchedCart;
	req.user
		.getCart()
		.then(cart => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then(products => {
			console.log(products);
			return req.user
				.createOrder()
				.then(order => {
					return order.addProducts(
						products.map(product => {
							product.orderItem = { quantity: product.cartItem.quantity };
							return product;
						})
					);
				})
				.catch(err => console.log(err));
		})
		.then(result => {
			return fetchedCart.setProducts(null);
		})
		.then(result => {
			res.redirect("/orders");
		})
		.catch(err => console.log(err));
};

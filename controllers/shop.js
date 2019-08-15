const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
	console.log("In the Shop Products directory");
	Product.findAll()
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
	Product.findByPk(prodId)
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
	Product.findAll()
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
			// Product.fetchAll(products => {
			// 	const cartProducts = [];
			// 	for (product of products) {
			// 		const cartProductData = cart.products.find(
			// 			prod => prod.id == product.id
			// 		);
			// 		if (cartProductData) {
			// 			cartProducts.push({
			// 				productData: product,
			// 				quantity: cartProductData.quantity
			// 			});
			// 		}
			// 	}
			// 	cartProducts.totalPrice = cart.totalPrice;

			// 	res.render("shop/cart", {
			// 		products: cartProducts,
			// 		docTitle: "Your Cart",
			// 		path: "/cart"
			// 	});
			// });
		})
		.catch(err => console.log(err));
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
    let fetchedCart;
    let newQuantity = 1;
	req.user
		.getCart()
		.then(cart => {
			fetchedCart = cart;
			return cart.getProducts({ where: { id: productId } });
		})
		.then(products => {
			let product;
			if (products.length > 0) {
				product = products[0];
			}
			if (product) {
				const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product
			}
			return Product.findByPk(productId);
		})
		.then(product => {
			return fetchedCart.addProduct(product, {
				through: { quantity: newQuantity }
			});
		})
		.then(() => {
			res.redirect("/cart");
		})
		.catch(err => console.log(err));

	// Product.findById(productId, product => {
	// 	console.log(product);
	// 	Cart.addProduct(product.id, product.price);
	// 	res.redirect("/cart");
	// });
};

exports.postDeleteProdcutFromCart = (req, res, next) => {
	const id = req.body.id;
	const price = req.body.price;
	Cart.deleteProduct(id, price);
	res.redirect("/cart");
};

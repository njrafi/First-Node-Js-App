const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
	console.log("In the Admin add product directory");
	res.render("admin/edit-product", {
		docTitle: "Add Product",
		path: "/admin/add-product",
		editing: false
	});
};

exports.getEditProduct = (req, res, next) => {
	console.log("In the Admin Edit product directory");
	let editMode = req.query.edit;
	const productId = req.params.productId;
	console.log("Inside the admin edit product page , Product id = " + productId);
	Product.findByPk(productId)
		.then(product => {
			if (!product) {
				console.log(
					"error : Could not find a product in admin edit product directory"
				);
				res.redirect("/");
			}
			res.render("admin/edit-product", {
				docTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				product: product
			});
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
	console.log("In the Admin Products directory");
	req.user.getProducts()
		.then(products => {
			res.render("admin/products", {
				prods: products,
				docTitle: "Admin Products",
				path: "/admin/products"
			});
		})
		.catch(err => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
	console.log("In The postAddProduct call");
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	req.user
		.createProduct({
			title: title,
			price: price,
			imageUrl: imageUrl,
			description: description
		})
		.then(result => {
			console.log("Created a Product");
			res.redirect("/");
		})
		.catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	console.log("In The postEditProduct call");
	const id = req.body.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	Product.update(
		{
			title: title,
			price: price,
			imageUrl: imageUrl,
			description: description
		},
		{ where: { id: id } }
	)
		.then(result => {
			console.log(result);

			res.redirect("/admin/products");
		})
		.catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const id = req.params.productId;
	Product.destroy({ where: { id: id } })
		.then(result => {
			console.log(result);

			res.redirect("/admin/products");
		})
		.catch(err => console.log(err));
};

const Product = require("../models/product");
const { validationResult } = require("express-validator");
const fileHelper = require("../utils/file");

exports.getAddProduct = (req, res, next) => {
	console.log("In the Admin add product directory");
	res.render("admin/edit-product", {
		docTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
		hasError: false,
		errorMessage: req.flash("error"),
		validationErrors: []
	});
};

exports.getEditProduct = (req, res, next) => {
	console.log("In the Admin Edit product directory");
	let editMode = req.query.edit;
	const productId = req.params.productId;
	console.log("Inside the admin edit product page , Product id = " + productId);
	Product.findById(productId)
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
				product: product,
				hasError: false,
				errorMessage: req.flash("error"),
				validationErrors: []
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.getProducts = (req, res, next) => {
	console.log("In the Admin Products directory");
	Product.find({ userId: req.user._id })
		.then(products => {
			res.render("admin/products", {
				prods: products,
				docTitle: "Admin Products",
				path: "/admin/products"
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postAddProduct = (req, res, next) => {
	console.log("In The postAddProduct call");
	const title = req.body.title;
	const image = req.file;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product({
		title: title,
		price: price,
		description: description,
		userId: req.user._id
	});

	const errors = validationResult(req);
	if (!errors.isEmpty() || image == null) {
		console.log(errors.array());
		errorMessage = errors.array()[0].msg;
		if (image == null) {
			errorMessage = "Attached file is not an valid image.";
		}
		return res.status(422).render("admin/edit-product", {
			docTitle: "Add Product",
			path: "/admin/edit-product",
			editing: false,
			hasError: true,
			product: product,
			errorMessage: errorMessage,
			validationErrors: errors.array()
		});
	}

	product.imageUrl = "/" + image.path;

	console.log("No validation error in adding product");

	product
		.save()
		.then(result => {
			console.log("Product saved successfully");
			res.redirect("/admin/products");
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	console.log("In The postEditProduct call");
	const id = req.body.productId;
	const title = req.body.title;
	const image = req.file;
	const price = req.body.price;
	const description = req.body.description;

	const product = new Product({
		title: title,
		price: price,
		description: description,
		userId: req.user._id,
		_id: id
	});

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render("admin/edit-product", {
			docTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: true,
			hasError: true,
			product: product,
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array()
		});
	}

	console.log("No validation error in editing product");
	Product.findById(id)
		.then(product => {
			if (product.userId.toString() != req.user._id.toString()) {
				console.log(product.userId);
				console.log(req.user._id);
				console.log("trying to edit other's product");
				return res.redirect("/");
			}
			product.title = title;
			if (image) {
				const oldImagePath = product.imageUrl.substring(1);
				fileHelper.deleteFile(oldImagePath);
				product.imageUrl = "/" + image.path;
			}
			product.price = price;
			product.description = description;
			return product.save().then(result => {
				console.log("product updated successfully");
				console.log(result);
				res.redirect("/admin/products");
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.deleteProduct = (req, res, next) => {
	const id = req.params.productId;
	console.log("In The postDeleteproduct call");
	console.log("product id " + id);
	Product.findById(id)
		.then(product => {
			if (!product) {
				return next(new Error("Product not found"));
			}
			const oldImagePath = product.imageUrl.substring(1);
			fileHelper.deleteFile(oldImagePath);
			return Product.deleteOne({ _id: id, userId: req.user._id });
		})
		.then(result => {
			if (result) {
				console.log("product deleted successfully");

				return req.user.deleteFromCart(id).then(result => {
					return res.status(200).json({ message: "Success!" });
				});
			} else {
				console.log("trying to delete other's product");
				return res.status(200).json({ message: "Success!" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: "Deleting Product Failed." });
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

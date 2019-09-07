const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
	console.log("In the Admin add product directory");
	res.render("admin/edit-product", {
		docTitle: "Add Product",
		path: "/admin/add-product",
        editing: false,
        isLoggedIn: req.session.isLoggedIn
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
                isLoggedIn: req.session.isLoggedIn
			});
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
	console.log("In the Admin Products directory");
    Product.find()
		.then(products => {
			res.render("admin/products", {
				prods: products,
				docTitle: "Admin Products",
				path: "/admin/products",
                isLoggedIn: req.session.isLoggedIn
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
	const product = new Product({
		title: title,
		price: price,
		description: description,
        imageUrl: imageUrl,
        userId: req.user._id
	});
	product
		.save()
		.then(result => {
			console.log("Product saved successfully");
			res.redirect("/admin/products");
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

	Product.findById(id)
		.then(product => {
			product.title = title;
			product.imageUrl = imageUrl;
			product.price = price;
			product.description = description;
			return product.save();
		})
		.then(result => {
			console.log("product updated successfully");
			console.log(result);
			res.redirect("/admin/products");
		})
		.catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const id = req.params.productId;
	console.log("In The postDeleteproduct call");
	console.log("product id " + id);
	Product.findByIdAndDelete(id)
		.then(result => {
			console.log("product deleted successfully");
			res.redirect("/admin/products");
		})
		.catch(err => console.log(err));
};

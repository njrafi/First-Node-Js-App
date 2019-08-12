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
	Product.findById(productId, product => {
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
	});
};

exports.getProducts = (req, res, next) => {
	console.log("In the Admin Products directory");
	Product.fetchAll(products => {
		res.render("admin/products", {
			prods: products,
			docTitle: "Admin Products",
			path: "/admin/products"
		});
	});
};

exports.postAddProduct = (req, res, next) => {
	console.log("In The postAddProduct call");
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(null, title, imageUrl, price, description);
	console.log(product);
	product.save();
	res.redirect("/");
};

exports.postEditProduct = (req, res, next) => {
	console.log("In The postEditProduct call");
	const id = req.body.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const product = new Product(id, title, imageUrl, price, description);
	console.log(product);
	product.save();
	res.redirect("/admin/products");
};

exports.postDeleteProduct = (req,res,next) => {
    const id = req.params.productId
    Product.deleteById(id)
    res.redirect("/admin/products");
}

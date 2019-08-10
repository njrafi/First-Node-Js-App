const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
	console.log("In the Admin add product directory");
	//res.sendFile(path.join(rootDir,'views' , 'add-product.html'))
	res.render("admin/add-product", {
		docTitle: "Add Product",
		path: "/admin/add-product"
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
	const product = new Product(req.body.title);
	product.save();
	res.redirect("/");
};
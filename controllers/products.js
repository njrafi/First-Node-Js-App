const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
	console.log("In the Shop directory");
	Product.fetchAll(products => {
		res.render("shop", {
			prods: products,
			docTitle: "Shop",
			path: "/shop"
		});
	});
};

exports.getAddProduct = (req, res, next) => {
	console.log("In the add product directory");
	//res.sendFile(path.join(rootDir,'views' , 'add-product.html'))
	res.render("add-product", {
		docTitle: "Add Product",
		path: "/add-product"
	});
};

exports.postProduct = (req, res, next) => {
	console.log("In The PostProduct call");
	const product = new Product(req.body.title);
	product.save();
	res.redirect("/");
};

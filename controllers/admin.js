const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
	console.log("In the add product directory");
	//res.sendFile(path.join(rootDir,'views' , 'add-product.html'))
	res.render("admin/add-product", {
		docTitle: "Add Product",
		path: "/admin/add-product"
	});
};

exports.postAddProduct = (req, res, next) => {
	console.log("In The postAddProduct call");
	const product = new Product(req.body.title);
	product.save();
	res.redirect("/");
};
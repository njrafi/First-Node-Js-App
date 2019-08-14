const fs = require("fs");
const path = require("path");
const Cart = require("../models/cart");

const p = path.join(
	path.dirname(process.mainModule.filename),
	"data",
	"products.json"
);

const getProductsFromFile = cb => {
	fs.readFile(p, (err, fileContent) => {
		if (!err && fileContent.length > 0) {
			return cb(JSON.parse(fileContent));
		} else {
			console.log(err);
			return cb([]);
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, price, description) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = parseFloat(price);
	}

	save() {
		getProductsFromFile(products => {
			if (this.id) {
				let existingProductIndex = products.findIndex(
					prod => prod.id == this.id
				);
				products[existingProductIndex] = this;
			} else {
				this.id = Math.random().toString();
				products.push(this);
			}
			fs.writeFile(p, JSON.stringify(products), err => {
				console.log(err);
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile(products => {
			const product = products.find(p => p.id === id);
			cb(product);
		});
	}

	static deleteById(id) {
		getProductsFromFile(products => {
			// let existingProductIndex = products.findIndex(prod => prod.id == id);
			// products.splice(existingProductIndex, 1);
			let product = products.find(prod => prod.id == id);
			// Deleting from cart also
			Cart.deleteProduct(id, product.price);
			let updatedProducts = products.filter(prod => prod.id != id);
			fs.writeFile(p, JSON.stringify(updatedProducts), err => {
				console.log("in deleteById of product model: " + err);
			});
		});
	}
};

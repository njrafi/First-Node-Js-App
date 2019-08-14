const db = require("../utils/database");
const Cart = require("../models/cart");
module.exports = class Product {
	constructor(id, title, imageUrl, price, description) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = parseFloat(price);
	}

	save() {
		return db.execute(
			"insert into products (title,price,imageUrl,description) values (?,?,?,?)",
			[this.title, this.price, this.imageUrl, this.description]
		);
	}

	static fetchAll() {
		return db.execute("select * from products");
	}

	static findById(id) {
		return db.execute("select * from products where id = ?", [id]);
	}

	static deleteById(id) {}
};

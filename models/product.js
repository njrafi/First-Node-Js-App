const getDb = require("../utils/database").getDb;
const ObjectId = require("mongodb").ObjectID;

class Product {
	constructor(title, price, description, imageUrl, id) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = ObjectId(id);
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			dbOp = db
				.collection("product")
				.updateOne({ _id: this._id }, { $set: this });
		} else {
			dbOp = db.collection("product").insertOne(this);
		}
		return dbOp
			.then(result => {
				console.log(result);
			})
			.catch(err => console.log(err));
	}

	static fetchAll() {
		const db = getDb();
		return db
			.collection("product")
			.find()
			.toArray()
			.then(products => {
				console.log(products);
				return products;
			})
			.catch(err => console.log(err));
	}

	static findById(id) {
		const db = getDb();
		return db
			.collection("product")
			.find({ _id: ObjectId(id) })
			.next()
			.then(product => {
				console.log("Product model find by id ");
				console.log(product);
				return product;
			})
			.catch(err => console.log(err));
	}
}

module.exports = Product;

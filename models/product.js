const getDb = require("../utils/database").getDb;
const ObjectId = require("mongodb").ObjectID;

class Product {
	constructor(title, price, description, imageUrl, id, userId) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		if (id) {
			this._id = ObjectId(id);
		}
		if (userId) {
			this.userId = ObjectId(userId);
		}
	}

	save() {
		const db = getDb();
		let dbOperation;
		if (this._id) {
			console.log("Updating product with id" + this._id);
			dbOperation = db
				.collection("product")
				.updateOne({ _id: this._id }, { $set: this });
		} else {
			console.log("adding product");
			dbOperation = db.collection("product").insertOne(this);
		}
		return dbOperation
			.then(result => {
				//console.log(result);
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
				return product;
			})
			.catch(err => console.log(err));
	}

	static deleteById(id) {
		const db = getDb();
		return db
			.collection("product")
			.deleteOne({ _id: ObjectId(id) })
			.then(result => {
				console.log("Product model deleted by id ");
				return result;
			})
			.catch(err => console.log(err));
	}
}

module.exports = Product;

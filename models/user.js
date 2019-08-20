const getDb = require("../utils/database").getDb;
const ObjectId = require("mongodb").ObjectID;

class User {
	constructor(name, email, cart, _id) {
		this.name = name;
		this.email = email;
		if (cart) {
			this.cart = cart; // {items = []}
		} else {
			this.cart = {};
			this.cart.items = [];
		}
		this._id = _id;
	}

	save() {
		const db = getDb();
		return db
			.collection("users")
			.insertOne(this)
			.then(result => {
				return result;
			})
			.catch(err => console.log(err));
	}

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex(cp => {
			return cp.productId.toString() === product._id.toString();
        });
        console.log("Adding to Cart " + cartProductIndex)

		if (cartProductIndex >= 0) {
			this.cart.items[cartProductIndex].quantity += 1;
		} else {
			this.cart.items.push({ productId: ObjectId(product._id), quantity: 1 });
		}
		console.log(this.cart.items);
		const db = getDb();
		return db
			.collection("users")
			.updateOne({ _id: ObjectId(this._id) }, { $set: this });
	}

	static findById(id) {
		const db = getDb();
		return db
			.collection("users")
			.find({ _id: ObjectId(id) })
			.next();
	}
}

module.exports = User;

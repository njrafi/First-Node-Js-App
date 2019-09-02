const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: "Product",
					required: true
				},
				quantity: { type: Number, required: true }
			}
		]
	}
});

userSchema.methods.addToCart = function(product) {

	const cartProductIndex = this.cart.items.findIndex(cp => {
		return cp.productId.toString() === product._id.toString();
	});
	console.log("Adding to Cart " + cartProductIndex);

	if (cartProductIndex >= 0) {
		this.cart.items[cartProductIndex].quantity += 1;
	} else {
		this.cart.items.push({ productId: product._id, quantity: 1 });
	}
	console.log(this.cart.items);
	return this.save()
};

module.exports = mongoose.model("User", userSchema);

// const getDb = require("../utils/database").getDb;
// const ObjectId = require("mongodb").ObjectID;

// class User {
// 	constructor(name, email, cart, _id) {
// 		this.name = name;
// 		this.email = email;
// 		if (cart) {
// 			this.cart = cart; // {items = []}
// 		} else {
// 			this.cart = {};
// 			this.cart.items = [];
// 		}
// 		this._id = _id;
// 	}

// 	save() {
// 		const db = getDb();
// 		return db
// 			.collection("users")
// 			.insertOne(this)
// 			.then(result => {
// 				return result;
// 			})
// 			.catch(err => console.log(err));
// 	}

// 	addToCart(product) {
// 		const cartProductIndex = this.cart.items.findIndex(cp => {
// 			return cp.productId.toString() === product._id.toString();
// 		});
// 		console.log("Adding to Cart " + cartProductIndex);

// 		if (cartProductIndex >= 0) {
// 			this.cart.items[cartProductIndex].quantity += 1;
// 		} else {
// 			this.cart.items.push({ productId: ObjectId(product._id), quantity: 1 });
// 		}
// 		console.log(this.cart.items);
// 		const db = getDb();
// 		return db
// 			.collection("users")
// 			.updateOne({ _id: ObjectId(this._id) }, { $set: this });
// 	}

// 	addOrder() {
// 		const db = getDb();
// 		return this.getCart()
// 			.then(products => {
// 				const order = {
// 					items: products,
// 					user: {
// 						_id: ObjectId(this._id),
// 						name: this.name
// 					}
// 				};
// 				return db.collection("orders").insertOne(order);
// 			})
// 			.then(result => {
// 				this.cart.items = [];
// 				return db
// 					.collection("users")
// 					.updateOne({ _id: ObjectId(this._id) }, { $set: this });
// 			})
// 			.catch(err => console.log(err));
// 	}

// 	deleteFromCart(id) {
// 		this.cart.items = this.cart.items.filter(item => {
// 			return item.productId.toString() != id.toString();
// 		});
// 		const db = getDb();
// 		return db
// 			.collection("users")
// 			.updateOne({ _id: ObjectId(this._id) }, { $set: this });
// 	}

// 	getCart() {
// 		const db = getDb();
// 		const productIds = this.cart.items.map(item => {
// 			return item.productId;
// 		});
// 		console.log("In get cart : Product Ids ");
// 		console.log(productIds);
// 		return db
// 			.collection("product")
// 			.find({ _id: { $in: productIds } })
// 			.toArray()
// 			.then(products => {
// 				console.log("in get Cart: Product List ");
// 				console.log(products);
// 				return products.map(product => {
// 					return {
// 						...product,
// 						quantity: this.cart.items.find(item => {
// 							return item.productId.toString() == product._id.toString();
// 						}).quantity
// 					};
// 				});
// 			})
// 			.catch(err => console.log(err));
// 	}

// 	getOrders() {
// 		const db = getDb();
// 		return db
// 			.collection("orders")
// 			.find({ "user._id": ObjectId(this._id) })
// 			.toArray()
// 			.then(orders => {
// 				console.log("orders array");
// 				console.log(orders);
// 				return orders;
// 			})
// 			.catch(err => console.log(err));
// 	}

// 	static findById(id) {
// 		const db = getDb();
// 		return db
// 			.collection("users")
// 			.find({ _id: ObjectId(id) })
// 			.next();
// 	}
// }

// module.exports = User;

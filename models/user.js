const getDb = require("../utils/database").getDb;
const ObjectId = require("mongodb").ObjectID;

class User {
	constructor(name, email) {
		this.username = name;
		this.email = email;
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

	static findById(id) {
		const db = getDb();
		return db
			.collection("users")
			.find({ _id: ObjectId(id) })
			.next();
	}
}

module.exports = User;

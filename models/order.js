const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	products: [
		{
			product: {
				type: Object,
				required: true
			},
			quantity: {
				type: Number,
				required: true
			}
		}
	],
	user: {
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		name: {
			type: String,
			required: true
		}
	}
});

module.exports = mongoose.model("Order", orderSchema);

// 				const order = {
// 					items: products,
// 					user: {
// 						_id: ObjectId(this._id),
// 						name: this.name
// 					}

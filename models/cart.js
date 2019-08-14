const fs = require("fs");
const path = require("path");

const p = path.join(
	path.dirname(process.mainModule.filename),
	"data",
	"cart.json"
);

// Helper function: Reading the cart to file
const getCartFromFile = cb => {
	fs.readFile(p, (err, fileContent) => {
		let cart = { products: [], totalPrice: 0 };
		if (!err && fileContent.length > 0) {
			cart = JSON.parse(fileContent);
		}
		cb(cart);
	});
};

// Helper function: Saving the cart to file
const saveCartToFile = cart => {
	console.log("saving new cart to file ");
	console.log(cart);

	fs.writeFile(p, JSON.stringify(cart), err => {
		console.log(err);
	});
};

module.exports = class Cart {
	static addProduct(id, productPrice) {
		getCartFromFile(cart => {
			let existingProductIndex = cart.products.findIndex(
				prod => prod.id === id
			);

			if (existingProductIndex != -1) {
				cart.products[existingProductIndex].quantity += 1;
			} else {
				cart.products.push({ id: id, quantity: 1 });
			}
			cart.totalPrice += productPrice;

			saveCartToFile(cart);
		});
	}

	static deleteProduct(id, productPrice) {
		getCartFromFile(cart => {
			let existingProductIndex = cart.products.findIndex(
				prod => prod.id === id
			);

			if (existingProductIndex != -1) {
				cart.totalPrice -=
					productPrice * cart.products[existingProductIndex].quantity;
				cart.products.splice(existingProductIndex, 1);
			}
			saveCartToFile(cart);
		});
	}

	static getCart(cb) {
		getCartFromFile(cart => {
            cb(cart)
        });
	}
};

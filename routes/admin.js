const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { check, body } = require("express-validator");

router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getProducts);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
	"/add-product",
	[
		body("title")
			.isString()
			.isLength({ min: 3 })
			.trim()
			.withMessage("Enter a Valid Title with minimum Length of 3"),
		body("price")
			.isFloat()
			.withMessage("Enter a Valid Price"),
		body("description")
			.isLength({ min: 5, max: 400 })
			.trim()
			.withMessage(
				"Enter a Valid Description with minimum Length of 5 and maximum 400"
			)
	],
	isAuth,
	adminController.postAddProduct
);

router.post(
	"/edit-product",
	[
		body("title")
			.isString()
			.isLength({ min: 3 })
			.trim()
			.withMessage("Enter a Valid Title with minimum Length of 3"),
		body("price")
			.isFloat()
			.withMessage("Enter a Valid Price"),
		body("description")
			.isLength({ min: 5, max: 400 })
			.trim()
			.withMessage(
				"Enter a Valid Description with minimum Length of 5 and maximum 400"
			)
	],
	isAuth,
	adminController.postEditProduct
);

router.post(
	"/delete-product/:productId",
	isAuth,
	adminController.postDeleteProduct
);
module.exports = router;

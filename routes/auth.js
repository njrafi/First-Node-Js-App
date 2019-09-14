const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check, body } = require("express-validator/check");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignUp);
router.get("/reset/:token", authController.getNewPassword);
router.get("/reset", authController.getReset);

router.post(
	"/login",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email."),
		body("password", "Password Length should be atleast 6").isLength({
			min: 6
		})
	],
	authController.postLogin
);
router.post(
	"/signup",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email.")
			.custom((email, { req }) => {
				return User.findOne({ email: email }).then(user => {
					if (user) {
						return Promise.reject("User already exists in Database");
					}
					return true;
				});
			}),
		body("password", "Password Length should be atleast 6").isLength({
			min: 6
		}),
		body("confirmPassword").custom((value, { req }) => {
			if (value !== req.body.password) {
				return Promise.reject("Passwords should match");
			}
			return true;
		})
	],
	authController.postSignUp
);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);
module.exports = router;

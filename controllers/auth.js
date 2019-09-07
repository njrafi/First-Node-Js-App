const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
	console.log("In Login Page");
	console.log(req.session);
	res.render("auth/login", {
		docTitle: "login",
		path: "/login",
		isLoggedIn: req.session.isLoggedIn
	});
};

exports.getSignUp = (req, res, next) => {
	console.log("In SignUp Page");
	console.log(req.session);
	res.render("auth/signup", {
		docTitle: "Sign Up",
		path: "/signup",
		isLoggedIn: req.session.isLoggedIn
	});
};

exports.postLogin = (req, res, next) => {
	console.log("In Post Login");
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				console.log("could not find the user");
				return res.redirect("/login");
			}
			console.log("Found User: " + user._id + " " + user.email);

			bcrypt
				.compare(password, user.password)
				.then(mathed => {
					if (!mathed) {
						console.log("Wrong Password");
						return res.redirect("/login");
					}
					req.session.user = user;
					req.session.isLoggedIn = true;
					req.session.save(err => {
						return res.redirect("/");
					});
				})
				.catch(err => {
					console.log(err);
					res.redirect("/login");
				});
		})
		.catch(err => console.log(err));
};

exports.postSignUp = (req, res, next) => {
	console.log("In Post Sign Up");
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	User.findOne({ email: email })
		.then(user => {
			if (user) {
				console.log("User already exists");
				return res.redirect("/login");
			}
			return bcrypt
				.hash(password, 12)
				.then(hashedPassword => {
					// Creating a new user
					const newUser = new User({
						email: email,
						password: hashedPassword
					});
					return newUser.save();
				})
				.then(result => {
					return res.redirect("/login");
				});
		})
		.catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
	console.log("In Post LogOut");
	req.session.destroy(err => {
		console.log(err);
		res.redirect("/");
	});
};

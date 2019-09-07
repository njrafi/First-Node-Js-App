const User = require("../models/user");

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
	User.findById("5d6be527eaefe92208523bbb")
		.then(user => {
			console.log(
				"Found User: " + user._id + " " + user.name + " " + user.email
			);
			req.session.user = user;
			req.session.isLoggedIn = true;
			req.session.save(err => {
				res.redirect("/");
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
            // Creating a new user
			const newUser = new User({
				email: email,
				password: password
			});
			return newUser.save();
		})
		.then(result => {
			return res.redirect("/login");
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

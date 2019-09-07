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

exports.postLogin = (req, res, next) => {
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

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect("/");
	});
};

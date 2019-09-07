exports.getLogin = (req, res, next) => {
	console.log("In Login Page");
	console.log(req.session.isLoggedIn);
	res.render("auth/login", {
		docTitle: "login",
		path: "/login",
		isLoggedIn: req.session.isLoggedIn
	});
};

exports.postLogin = (req, res, next) => {
	req.session.isLoggedIn = true;
	res.redirect("/");
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect("/");
	});
};

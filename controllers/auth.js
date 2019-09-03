exports.getLogin = (req, res, next) => {
	console.log("In Login Page");
	res.render("auth/login", { docTitle: "login", path: "/login" });
};

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const transporter = nodemailer.createTransport(
	sendGridTransport({
		auth: {
			api_key: process.env.sendGridApi
		}
	})
);
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
	console.log("In Login Page");
	console.log(req.session);
	res.render("auth/login", {
		docTitle: "login",
		path: "/login",
		errorMessage: req.flash("error"),
		oldInput: { email: "", password: "" },
		validationErrors: []
	});
};

exports.getSignUp = (req, res, next) => {
	console.log("In SignUp Page");
	console.log(req.session);
	res.render("auth/signup", {
		docTitle: "Sign Up",
		path: "/signup",
		errorMessage: req.flash("error"),
		validationErrors: []
	});
};

exports.getReset = (req, res, next) => {
	console.log("In Reset Password Page");
	console.log(req.session);
	res.render("auth/reset", {
		docTitle: "Reset Password",
		path: "/reset",
		errorMessage: req.flash("error")
	});
};

exports.postLogin = (req, res, next) => {
	console.log("In Post Login");
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render("auth/login", {
			docTitle: "login",
			path: "/login",
			errorMessage: errors.array()[0].msg,
			oldInput: { email: email, password: password },
			validationErrors: errors.array()
		});
	}

	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				console.log("could not find the user");
				req.flash("error", "Invalid Email");
				return res.redirect("/login");
			}
			console.log("Found User: " + user._id + " " + user.email);

			bcrypt
				.compare(password, user.password)
				.then(mathed => {
					if (!mathed) {
						console.log("Wrong Password");
						req.flash("error", "Wrong Password");
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
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postSignUp = (req, res, next) => {
	console.log("In Post Sign Up");
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render("auth/signup", {
			docTitle: "Sign Up",
			path: "/signup",
			errorMessage: errors.array()[0].msg,
			oldInput: { email: email, password: password },
			validationErrors: errors.array()
		});
	}

	bcrypt
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
			res.redirect("/login");
			return transporter.sendMail({
				to: email,
				from: "admin@node-shop.com",
				subject: "signUp succeded",
				html: "<h1> You successfully signed up </h1>"
			});
		})
		.then(result => {
			console.log(result);
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postLogout = (req, res, next) => {
	console.log("In Post LogOut");
	req.session.destroy(err => {
		console.log(err);
		res.redirect("/");
	});
};

exports.postReset = (req, res, next) => {
	const email = req.body.email;
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect("/reset");
		}
		const token = buffer.toString("hex");
		User.findOne({ email: email })
			.then(user => {
				if (!user) {
					req.flash("error", "Could not find any user!");
					return res.redirect("/reset");
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600 * 1000; // 1 hour
				return user.save();
			})
			.then(result => {
				res.redirect("/login");
				return transporter.sendMail({
					to: email,
					from: "admin@node-shop.com",
					subject: "Password reset",
					html: `
                        <p> You requested a password request </p>
                        <p> Click this <a href="${process.env.host}:${process.env.port}/reset/${token}" >link</a> to set a new password. </p>

                    `
				});
			})
			.then(result => {
				console.log("reset mail sent successfully");
				console.log(result);
			})
			.catch(err => {
				console.log(err);
				const error = new Error(err);
				error.httpStatusCode = 500;
				next(error);
			});
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then(user => {
			if (!user) {
				req.flash("error", "invalid token");
				res.redirect("/reset");
			}
			res.render("auth/new-password", {
				docTitle: "Set New Password",
				path: "/new-password",
				errorMessage: req.flash("error"),
				userId: user._id.toString(),
				token: token
			});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postNewPassword = (req, res, next) => {
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	const userId = req.body.userId;
	const token = req.body.token;
	if (password != confirmPassword) {
		req.flash("error", "Passwords Does not Match.Try Again");
		return res.redirect("/reset/" + token);
	}

	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId
	})
		.then(user => {
			if (!user) {
				req.flash("error", "Could not find user");
				return res.redirect("/login");
			}
			return bcrypt
				.hash(password, 12)
				.then(hashedPassword => {
					user.password = hashedPassword;
					user.resetToken = undefined;
					user.resetTokenExpiration = undefined;
					return user.save();
				})
				.then(result => {
					res.redirect("/login");
					return transporter.sendMail({
						to: user.email,
						from: "admin@node-shop.com",
						subject: "Password reset successfull",
						html: `
                        <p> Your password reset is successful </p>
                        <p> You can login now </p>
                    `
					});
				})
				.then(result => {
					console.log("reset successful mail sent successfully");
					console.log(result);
				})
				.catch(err => {
					console.log(err);
					const error = new Error(err);
					error.httpStatusCode = 500;
					next(error);
				});
		})
		.catch(err => {
			console.log(err);
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

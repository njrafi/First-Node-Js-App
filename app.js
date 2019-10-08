const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flush = require("connect-flash");
const secrets = require("./secrets");
const multer = require("multer");

const mongoDbUri = secrets.mongoDbUri;

const app = express();

const store = new mongoDbStore({
	uri: mongoDbUri,
	collection: "sessions"
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
		);
	}
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const errorController = require("./controllers/error");

const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
	session({
		secret: secrets.sessionSecretKey,
		resave: false,
		saveUninitialized: false,
		store: store
	})
);
app.use(csrfProtection);
app.use(flush());

app.use((req, res, next) => {
	res.locals.isLoggedIn = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}

	User.findById(req.session.user._id)
		.then(user => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch(err => {
			throw new Error(err);
		});
});

// Registering Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use("/500", errorController.get500Page);
app.use(errorController.get404Page);
app.use((error, req, res, next) => {
	console.log(error);
	res.redirect("/500");
});

mongoose
	.connect(mongoDbUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(result => {
		console.log("connected to mongoDb Database");
		console.log("server started at port " + secrets.port);
		app.listen(secrets.port);
	})
	.catch(err => console.log(err));

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const errorController = require("./controllers/error");

//const User = require("./models/user");
app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
// 	User.findById("5d59a3905abb4e39102eaf2d")
// 		.then(user => {
// 			// console.log(
// 			// 	"Found User: " + user._id + " " + user.name + " " + user.email
// 			// );
// 			req.user = new User(user.name, user.email, user.cart, user._id);
// 			next();
// 		})
// 		.catch(err => console.log(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

mongoose
	.connect(
		"mongodb+srv://njrafi:NodeJs1234@nodejscluster-zwpxh.mongodb.net/shop?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(result => {
		console.log(result);
		console.log("connected to mongoDb Database");
		app.listen(3000);
	})
	.catch(err => console.log(err));

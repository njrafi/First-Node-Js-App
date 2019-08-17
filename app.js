const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const errorController = require("./controllers/error");

const mongoConnect = require("./utils/database").mongoConnect;

app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

app.use(
	bodyParser.urlencoded({
		extended: false
	})
);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	// We need the user in our request
	// User.findByPk(1)
	// 	.then(user => {
	// 		req.user = user;
	// 		next();
	// 	})
	// 	.catch(err => console.log(err));
	next();
});

app.use("/admin", adminRoutes);
// app.use(shopRoutes);
// app.use(errorController.get404Page);

mongoConnect(() => {
	//console.log(client)
	app.listen(3000);
});

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const errorController = require("./controllers/error");
const db = require("./utils/database");
app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

db.execute("select * from products")
	.then(result => {
		console.log(result);
	})
	.catch(err => {
		console.log(err);
	});

app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

app.listen(3000);

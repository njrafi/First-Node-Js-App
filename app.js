const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const errorController = require("./controllers/error");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

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

app.use((req, res, next) => {
	// We need the user in our request
	User.findByPk(1)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404Page);

// Table RelationShips
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
	.sync()
	.then(result => {
		return User.findByPk(1);
	})
	.then(user => {
		if (!user) {
			return User.create({ name: "NJRafi", email: "njrafibd@gmail.com" });
		}
		return user;
	})
	.then(user => {
		return user.createCart();
	})
	.then(cart => app.listen(3000))
	.catch(err => console.log(err));

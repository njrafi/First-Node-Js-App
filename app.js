const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const expressHbs = require("express-handlebars");

app.engine(
  "handleBars",
  expressHbs({ layoutsDir: "views/layouts/", defaultLayout: "main-layout" })
);
app.set("view engine", "handleBars");
app.set("views", "views");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  // 404 error page
  console.log("In the 404 Error Page");
  res.status(404).render("404", { docTitle: "Are You Lost?", layout: false });
  //res.status(404).sendFile(path.join(__dirname,  'views' , '404.html'))
});

app.listen(3000);

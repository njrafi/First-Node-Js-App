const express = require("express");
const path = require("path");
const rootDir = require("../utils/path");
const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  console.log("In the add product directory");
  //res.sendFile(path.join(rootDir,'views' , 'add-product.html'))
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/add-product",
  });
});

router.post("/product", (req, res, next) => {
  console.log(req.body.title);
  products.push(req.body.title);
  console.log(products);
  res.redirect("/");
});

exports.routes = router;
exports.products = products;

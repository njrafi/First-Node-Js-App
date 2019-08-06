const express = require("express");
const router = express.Router();
const productViewController = require('../controllers/products')

router.get("/add-product", productViewController.getAddProduct);

router.post("/product", productViewController.postProduct);

module.exports = router;

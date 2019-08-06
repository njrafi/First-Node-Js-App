const express = require("express");
const router = express.Router();
const productViewController = require('../controllers/products')

router.get("/", productViewController.getProducts );

module.exports = router;
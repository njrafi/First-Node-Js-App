const express = require("express");
const router = express.Router();
const shopViewController = require("../controllers/shop");

router.get("/", shopViewController.getProducts);
router.get("/products", shopViewController.getProducts);
router.get("/cart", shopViewController.getProducts);
router.get("/checkout", shopViewController.getProducts);

module.exports = router;

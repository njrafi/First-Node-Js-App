const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/product/:productId", shopController.getProduct);
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckout);
router.get("/orders", shopController.getOrders);

router.post("/cart" , shopController.postCart)
module.exports = router;

const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/product/:productId", shopController.getProduct);
router.get("/cart", isAuth, shopController.getCart);
// router.get("/checkout", shopController.getCheckout);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.post("/cart", isAuth, shopController.postCart);
router.post(
	"/delete-cart-product",
	isAuth,
	shopController.postDeleteProductFromCart
);
router.post("/create-order", isAuth, shopController.postOrder);
module.exports = router;

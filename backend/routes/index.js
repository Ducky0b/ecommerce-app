var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome!");
});
//auth
const authRouter = require("./auth.api");
router.use("/auth", authRouter);
//user
const userRouter = require("./user.api");
router.use("/users", userRouter);
//product
const productRouter = require("./product.api");
router.use("/products", productRouter);
//category
const categoryRouter = require("./category.api");
router.use("/categories", categoryRouter);
//cart
const cartRouter = require("./cart.api");
router.use("/cart", cartRouter);
//order
const orderRouter = require("./order.api");
router.use("/orders", orderRouter);

module.exports = router;

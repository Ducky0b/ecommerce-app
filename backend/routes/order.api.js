const express = require("express");
const { loginRequired } = require("../middleware/authentication");
const { body, param } = require("express-validator");
const router = express.Router();
const validators = require("../middleware/validators");
const {
  createOrder,
  getCurrentUserOrder,
  getAllOrders,
  updateStatusOrder,
  deleteOrder,
} = require("../controllers/order.controllers");

/**
 * @route POST /orders
 * @description Create a new order from the cart.
 * @body { }
 * @access Login Required
 */
router.post("/", loginRequired, createOrder);
/**
 * @route GET /orders/me
 * @description Get the current user's order history.
 * @access Login Required
 */
router.get("/me", loginRequired, getCurrentUserOrder);
/**
 * @route GET /orders
 * @description Retrieve all orders.
 * @body { }
 */
router.get("/", getAllOrders);
/**
 * @route PUT /orders/:id/status
 * @description Update the order status.
 * @body { }
 */
router.put(
  "/:id/status",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  updateStatusOrder
);
/**
 * @route DELETE /orders/:id
 * @description DELETE the order status.
 * @body {id}
 */
router.delete("/:id", deleteOrder);
module.exports = router;

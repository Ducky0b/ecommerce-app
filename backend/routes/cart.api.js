const express = require("express");
const { loginRequired } = require("../middleware/authentication");
const { body, param } = require("express-validator");
const router = express.Router();
const validators = require("../middleware/validators");
const {
  AddItemToCart,
  getCurrentCartOfUser,
  updateQuantityItemCart,
  deleteItemFromCart,
} = require("../controllers/cart.controllers");
/**
 * @route POST /cart
 * @description Add item to the cart
 * @body { productId, quantity }
 * @access Login required
 */
router.post(
  "/",
  loginRequired,
  validators.validate([
    body("productId").exists().isString().custom(validators.checkObjectId),
  ]),
  AddItemToCart
);
/**
 * @route GET /cart
 * @description Get the user's shopping cart
 * @access Login required
 */
router.get("/:id", getCurrentCartOfUser);
/**
 * @route PUT /cart/:itemId
 * @description Update the quantity of an item in the cart.
 * @body { quantity }
 * @access Login required
 */
router.put(
  "/:itemId",
  loginRequired,
  validators.validate([
    param("itemId", "Invalid ObjectId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  updateQuantityItemCart
);
/**
 * @route DELETE /cart/:itemId
 * @description Remove an item from the cart.
 * @access Login required
 */
router.delete(
  "/:itemId",
  loginRequired,
  validators.validate([
    param("itemId", "Invalid ObjectId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  deleteItemFromCart
);
module.exports = router;

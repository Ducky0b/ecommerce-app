const express = require("express");
const { loginRequired } = require("../middleware/authentication");
const { body, param } = require("express-validator");
const router = express.Router();
const validators = require("../middleware/validators");
const {
  createProduct,
  getAllProducts,
  getSingleProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controllers");

/**
 * @route POST /products
 * @description Create new product
 * @body { name, description, price, category, color, size, imageUrl, stock }
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("description", "Invalid description").exists().notEmpty(),
    body("price", "Invalid price").exists().notEmpty().isNumeric(),
    body("size", "Invalid size")
      .exists()
      .notEmpty()
      .isIn(["S", "M", "L", "XL"]),
    body("color", "Invalid color").exists().notEmpty(),
    body("imageUrl", "Invalid imageUrl").exists().notEmpty().isURL(),
    body("stock", "Invalid stock").exists().notEmpty().isInt({ min: 0 }),
  ]),
  createProduct
);
/**
 * @route GET /products
 * @description Get products with pagination
 * @access Public
 */
router.get("/", getAllProducts);
/**
 * @route GET /products/:id
 * @description Get product details
 * @body { id }
 * @access Public
 */
router.get("/:id", getSingleProductById);
/**
 * @route PUT /products/:id
 * @description Update a product
 * @body { name, description, price, category, color, size, imageUrl, stock }
 * @access Public
 */
router.put("/:id", updateProduct);
/**
 * @route DELETE /products/:id
 * @description Delete a product
 * @access Public
 */
router.delete("/:id", deleteProduct);
module.exports = router;

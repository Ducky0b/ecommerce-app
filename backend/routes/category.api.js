const express = require("express");
const { loginRequired } = require("../middleware/authentication");
const { body, param } = require("express-validator");
const router = express.Router();
const validators = require("../middleware/validators");
const {
  createCategory,
  getAllCategories,
  getSingleCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controllers");

/**
 * @route POST /categories
 * @description Create a new category
 * @body { name, description }
 * @access Login required
 */
router.post("/", createCategory);
/**
 * @route GET /categories
 * @description Get all category with pagination
 * @access Login required
 */
router.get("/", getAllCategories);
/**
 * @route GET /categories/:id
 * @description Get single category by id
 * @access Login required
 */
router.get("/:id", getSingleCategoryById);
/**
 * @route PUT /categories/:id
 * @description Update a category
 * @body {name , description }
 * @access Login required
 */
router.put("/:id", updateCategory);
/**
 * @route DELETE /categories
 * @description Remove a category
 * @access Login required
 */
router.delete("/:id", deleteCategory);

module.exports = router;

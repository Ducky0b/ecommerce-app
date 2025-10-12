const express = require("express");
const {
  register,
  getUsers,
  getCurrentUser,
  getSingleUserById,
  getAllUsersStats,
  deleteUser,
  updateUser,
} = require("../controllers/user.controllers");
const router = express.Router();
const { body, param } = require("express-validator");
const validators = require("../middleware/validators");
const { loginRequired } = require("../middleware/authentication");

/**
 * @route POST /users
 * @description Register new user
 * @body {name , email, password}
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("password", "Invalid password").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
  ]),
  register
);
/**
 * @route GET /users?page=1&limit=10
 * @description Get users with pagination
 * @body
 * @access Login required
 */
router.get("/", getUsers);

/**
 * @route GET /users/me
 * @description Get current user info
 * @body
 * @access Login required
 */
router.get("/me", loginRequired, getCurrentUser);

/**
 * @route GET /users/:id
 * @description Get a user profile
 * @body
 * @access Login required
 */
router.get(
  "/:id",
  loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  getSingleUserById
);
/**
 * @route Update /users/:id
 * @description Update a user
 */
router.put("/:id", updateUser);
/**
 * @route DELETE /users/:id
 * @description DELETE a user
 */
router.delete(
  "/:id",
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  deleteUser
);

module.exports = router;

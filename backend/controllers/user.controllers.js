const User = require("../models/User");
const Order = require("../models/Order");
const { AppError, sendResponse } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const userControllers = {};

userControllers.register = async (req, res, next) => {
  try {
    //Get data from request
    let { username, name, phone, password, email } = req.body;
    //Validation
    let user = await User.findOne({ username });
    if (user)
      throw new AppError(400, "User already exists", "Resgistration Error");
    //Process
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({ username, name, phone, password, email });
    const accessToken = await user.generateToken();
    //Response
    sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      null,
      "Register Successful"
    );
  } catch (error) {
    next(error);
  }
};
userControllers.getUsers = async (req, res, next) => {
  try {
    const { userId } = req;
    let { page, limit, ...filter } = { ...req.query };

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterConditions = [{ isDeleted: false }];
    if (filter.name) {
      filterConditions.push({
        name: { $regex: filter.name, $options: "i" },
      });
    }
    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};
    const count = await User.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const user = await User.find(filterCriteria)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    if (!user) throw new AppError(400, "Bad Request", "Get all user error");

    sendResponse(
      res,
      200,
      true,
      user,
      { totalPage, count },
      null,
      "Get All User Succesful"
    );
  } catch (error) {
    next(error);
  }
};
userControllers.getCurrentUser = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) throw new AppError(400, "Bad Request", "Get current user error");
    sendResponse(
      res,
      200,
      true,
      user,
      null,
      null,
      "Get Current User Succesful"
    );
  } catch (error) {
    next(error);
  }
};
userControllers.getSingleUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user = await User.findById(id);
    if (!user) throw new AppError(400, "Bad Request", "Get single user error");
    user = user.toJSON();
    sendResponse(
      res,
      200,
      true,
      user,
      null,
      null,
      "Get Single User Succesfully"
    );
  } catch (error) {
    next(error);
  }
};
userControllers.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, avatarUrl, email, city, district, ward, address } =
      req.body;

    const user = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { name, phone, avatarUrl, email, city, district, ward, address },
      { new: true }
    );
    if (!user) {
      throw new AppError(404, "User not found", "Update user error");
    }

    sendResponse(res, 200, true, user, null, null, "User updated successfully");
  } catch (error) {
    next(error);
  }
};
userControllers.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!user) throw new AppError(400, "User not found", "Delete user error");

    sendResponse(res, 200, true, user, null, null, "Deleted user successfully");
  } catch (error) {
    next(error);
  }
};
module.exports = userControllers;

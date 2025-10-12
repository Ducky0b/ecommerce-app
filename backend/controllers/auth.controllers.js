const { AppError, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authControllers = {};

authControllers.loginWithEmail = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }, "+password");
    if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError(400, "Wrong password", "Login error");
    const accessToken = await user.generateToken();

    sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      null,
      "Login Succesful"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = authControllers;

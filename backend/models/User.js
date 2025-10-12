const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, uniqe: true },
    avatarUrl: { type: String, required: false, default: "" },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: true },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    address: { type: String },

    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },

    role: { type: String, default: "" },

    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamp: true }
);

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};
userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

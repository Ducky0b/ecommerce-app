const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: { type: Boolean, default: false, select: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

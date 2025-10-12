const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipping",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    totalAmount: { type: Number, default: 0 },
    totalProduct: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, select: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

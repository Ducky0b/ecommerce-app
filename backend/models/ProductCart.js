const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productCartSchema = Schema(
  {
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    color: { type: String, required: true },
    size: {
      type: String,
      required: true,
      enum: ["S", "M", "L", "XL"],
    },
    isDeleted: { type: Boolean, default: false, select: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductCart", productCartSchema);

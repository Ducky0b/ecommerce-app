const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOrderSchema = Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
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
const ProductOrder = mongoose.model("ProductOrder", productOrderSchema);
module.exports = ProductOrder;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productCategorySchema = Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },

    isDeleted: { type: Boolean, default: false, select: true },
  },
  { timestamp: true }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

module.exports = ProductCategory;

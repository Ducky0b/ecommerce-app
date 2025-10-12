const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true, default: "" },
    price: { type: Number, required: true, default: 0, min: 0 },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    thumbnail: { type: String, required: true, default: "" }, //Ảnh đại diện chính
    variants: [
      {
        color: { type: String, required: true },
        sizes: [
          {
            size: {
              type: String,
              enum: ["S", "M", "L", "XL"],
              required: true,
            },
            stock: {
              type: Number,
              required: true,
              min: 0,
            },
            sku: { type: String, required: true }, // mã riêng cho các biến thể
          },
        ],
        imageUrl: { type: String }, // ảnh riêng của biến thể
      },
    ],
    isDeleted: { type: Boolean, default: false, select: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

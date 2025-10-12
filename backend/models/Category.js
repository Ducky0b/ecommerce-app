const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  parentId: { type: Schema.Types.ObjectId, ref: "Category" },
  isDeleted: { type: Boolean, default: false, select: true },
});

module.exports = mongoose.model("Category", categorySchema);

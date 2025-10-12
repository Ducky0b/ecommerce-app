const Category = require("../models/Category");
const ProductCategory = require("../models/ProductCategory");
const { AppError, sendResponse } = require("../helpers/utils");

const categoryControllers = {};

categoryControllers.createCategory = async (req, res, next) => {
  try {
    const { name, description, parentId } = req.body;

    if (!name) {
      throw new AppError(
        400,
        "Category name is required",
        "Create category error"
      );
    }

    const existing = await Category.findOne({ name, isDeleted: false });
    if (existing) {
      throw new AppError(
        409,
        "Category already exists",
        "Create category error"
      );
    }

    const category = await Category.create({ name, description, parentId });

    sendResponse(
      res,
      201,
      true,
      category,
      null,
      null,
      "Category created successfully"
    );
  } catch (error) {
    next(error);
  }
};
categoryControllers.getAllCategories = async (req, res, next) => {
  try {
    let { page, limit, ...filter } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterConditions = [{ isDeleted: false }];
    if (filter.name) {
      filterConditions.push({
        name: { $regex: filter.name, $options: "i" },
      });
    }
    if (filter.parentId) {
      filterConditions.push({ parentId: filter.parentId });
    }

    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};

    const count = await Category.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const categories = await Category.find(filterCriteria)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("parentId", "_id name")
      .lean();

    if (!categories) {
      throw new AppError(404, "Category not found", "Get category error");
    }


    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await ProductCategory.find({
          categoryId: cat._id,
          isDeleted: false,
        })
          .populate("productId")
          .lean();

        return {
          ...cat,
          products: products.map((p) => p.productId),
        };
      })
    );

    sendResponse(
      res,
      200,
      true,
      categoriesWithProducts,
      { totalPage, count },
      null,
      "Fetched all categories with products"
    );
  } catch (error) {
    next(error);
  }
};
categoryControllers.getSingleCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categories = await Category.findOne({ _id: id, isDeleted: false });
    if (!categories) {
      throw new AppError(404, "Category not found", "Get category error");
    }
    const product_categories = await ProductCategory.find({
      categoryId: categories._id,
      isDeleted: false,
    })
      .populate({ path: "productId" })
      .lean();
    sendResponse(
      res,
      200,
      true,
      product_categories,
      null,
      null,
      "Fetched category successfully"
    );
  } catch (error) {
    next(error);
  }
};
categoryControllers.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { name, description },
      { new: true }
    );

    if (!category) {
      throw new AppError(404, "Category not found", "Update category error");
    }

    sendResponse(
      res,
      200,
      true,
      category,
      null,
      null,
      "Category updated successfully"
    );
  } catch (error) {
    next(error);
  }
};
categoryControllers.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!category) {
      throw new AppError(404, "Category not found", "Delete category error");
    }

    sendResponse(
      res,
      200,
      true,
      category,
      null,
      null,
      "Category deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = categoryControllers;

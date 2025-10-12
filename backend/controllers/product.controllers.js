const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");
const Category = require("../models/Category");
const { AppError, sendResponse } = require("../helpers/utils");

const productControllers = {};
const sizeOrder = ["S", "M", "L", "XL"];

productControllers.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      thumbnail,
      color,
      size,
      stock,
      sku,
      imageUrl,
    } = req.body;

    if (
      !name ||
      !price ||
      !categoryId ||
      !thumbnail ||
      !color ||
      !size ||
      stock == null ||
      !sku
    ) {
      throw new AppError(
        400,
        "Missing required fields",
        "Create product error"
      );
    }
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      throw new AppError(404, "Category not found", "Create product error");
    }

    let product = await Product.findOne({ name, categoryId, thumbnail });

    if (product) {
      const colorIndex = product.variants.findIndex(
        (variant) => variant.color.toLowerCase() === color.toLowerCase()
      );

      if (colorIndex > -1) {
        const sizeExists = product.variants[colorIndex].sizes.some(
          (variant) => variant.size === size
        );

        if (sizeExists) {
          throw new AppError(
            400,
            "Size already exists for this color",
            "Create product error"
          );
        }

        product.variants[colorIndex].sizes.push({ size, stock, sku });

        product.variants[colorIndex].sizes.sort(
          (a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
        );

        await product.save();

        return sendResponse(
          res,
          200,
          true,
          product,
          null,
          "Added new size to existing color"
        );
      } else {
        product.variants.push({
          color,
          sizes: [{ size, stock, sku }],
          imageUrl,
        });

        await product.save();

        return sendResponse(
          res,
          200,
          true,
          product,
          null,
          "Added new color variant"
        );
      }
    } else {
      const createdProduct = await Product.create({
        name,
        description,
        price,
        categoryId,
        thumbnail,
        variants: [
          {
            color,
            sizes: [{ size, stock, sku }],
            imageUrl,
          },
        ],
      });

      const newProduct = await Product.findById(createdProduct._id).populate(
        "categoryId"
      );

      const newProductCategory = await ProductCategory.create({
        productId: newProduct._id,
        categoryId,
      });
      return sendResponse(
        res,
        201,
        true,
        newProduct,
        newProductCategory,
        null,
        "Created new product with variant"
      );
    }
  } catch (error) {
    next(error);
  }
};

productControllers.getAllProducts = async (req, res, next) => {
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
    if (filter.categoryId) {
      filterConditions.push({
        categoryId: filter.categoryId,
      });
    }
    if (filter.categoryIds) {
      const ids = filter.categoryIds.split(",");
      filterConditions.push({ categoryId: { $in: ids } });
    }
    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};
    const count = await Product.countDocuments(filterCriteria);
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const products = await Product.find(filterCriteria)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    if (!products)
      throw new AppError(400, "Bad Request", "Get all products error");

    sendResponse(
      res,
      200,
      true,
      products,
      { totalPage, count },
      null,
      "Get all products succesfully"
    );
  } catch (error) {
    next(error);
  }
};
productControllers.getSingleProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id).populate(
      "categoryId",
      "name description"
    );

    sendResponse(
      res,
      200,
      true,
      product,
      null,
      null,
      "Get single product sucessfully"
    );
  } catch (error) {
    next(error);
  }
};
productControllers.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      categoryId,
      thumbnail,
      color,
      size,
      stock,
      sku,
      imageUrl,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      throw new AppError(404, "Product not found", "Update product error");
    }

    const updatableFields = ["name", "description", "price", "thumbnail"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });
    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        throw new AppError(404, "Category not exists", "Update product error");
      }

      const productCategoryExists = await ProductCategory.findOne({
        productId: product._id,
      });

      if (!productCategoryExists) {
        throw new AppError(404, "Category not found", "Update product error");
      }
      productCategoryExists.categoryId = categoryId;
      await productCategoryExists.save();

      product.categoryId = categoryId;
    }

    if (color && size) {
      const variant = product.variants.find(
        (variant) => variant.color.toLowerCase() === color.toLowerCase()
      );
      if (variant) {
        const sizeItem = variant.sizes.find((variant) => variant.size === size);
        if (sizeItem) {
          if (stock !== undefined) sizeItem.stock = stock;
        } else {
          variant.sizes.push({ size, stock: stock ?? 0, sku });
        }
        variant.sizes.sort(
          (a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
        );
      } else {
        product.variants.push({
          color,
          sizes: [{ size, stock: stock ?? 0, sku }],
          imageUrl,
        });
      }
    }

    await product.save();
    await product.populate("categoryId", "name description");
    sendResponse(
      res,
      200,
      true,
      product,
      null,
      null,
      "Product updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

productControllers.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!product)
      throw new AppError(400, "Product not found", "Delete product error");

    sendResponse(
      res,
      200,
      true,
      product,
      null,
      null,
      "Deleted product successfully"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = productControllers;

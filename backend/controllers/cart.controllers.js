const Cart = require("../models/Cart");
const ProductCart = require("../models/ProductCart");
const { AppError, sendResponse } = require("../helpers/utils");

const cartControllers = {};

const updateProductCartCount = async (cartId) => {
  const cart = await Cart.findById(cartId);
  if (!cart || cart.isDeleted) return;

  const items = await ProductCart.find({ cartId, isDeleted: false });
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  cart.itemCount = itemCount;
  await cart.save();
};

cartControllers.AddItemToCart = async (req, res, next) => {
  try {
    const { userId } = req;
    const { productId, quantity, color, size } = req.body;
    if (!productId || !quantity || !color || !size) {
      throw new AppError(400, "Missing fields", "Add item error");
    }

    let cart = await Cart.findOne({ userId, isDeleted: false });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let productCart = await ProductCart.findOne({
      cartId: cart._id,
      productId,
      color,
      size,
      isDeleted: false,
    });

    if (productCart) {
      productCart.quantity += quantity;
      await productCart.save();
    } else {
      productCart = await ProductCart.create({
        cartId: cart._id,
        productId,
        quantity,
        color,
        size,
      });
    }

    await updateProductCartCount(cart._id);

    sendResponse(
      res,
      200,
      true,
      productCart,
      null,
      null,
      "Add item to cart successfully"
    );
  } catch (error) {
    next(error);
  }
};
cartControllers.getCurrentCartOfUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findOne({ userId: id, isDeleted: false });

    if (!cart) {
      let items = [];
      let itemCount = 0;
      return sendResponse(
        res,
        200,
        true,
        items,
        itemCount,
        null,
        null,
        "Cart is empty"
      );
    }

    const items = await ProductCart.find({ cartId: cart._id, isDeleted: false })
      .populate({
        path: "productId",
        select: "name price thumbnail variants category",
      })
      .lean();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.itemCount !== itemCount) {
      cart.itemCount = itemCount;
      await cart.save();
    }

    sendResponse(
      res,
      200,
      true,
      items,
      itemCount,
      null,
      "Get the user's shopping cart successfully"
    );
  } catch (error) {
    next(error);
  }
};
cartControllers.updateQuantityItemCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      throw new AppError(
        400,
        "Quantity must be at least 1",
        "Update item error"
      );
    }

    const productCart = await ProductCart.findOne({
      _id: itemId,
      isDeleted: false,
    });
    if (!productCart) {
      throw new AppError(404, "Cart item not found", "Update item error");
    }

    productCart.quantity = quantity;
    await productCart.save();

    await updateProductCartCount(productCart.cartId);

    sendResponse(
      res,
      200,
      true,
      productCart,
      null,
      "Updated cart item quantity successfully"
    );
  } catch (error) {
    next(error);
  }
};
cartControllers.deleteItemFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const productCart = await ProductCart.findByIdAndUpdate(
      itemId,
      { isDeleted: true },
      { new: true }
    );
    if (!productCart) {
      throw new AppError(404, "Cart item not found", "Delete item error");
    }

    await updateProductCartCount(productCart.cartId);

    sendResponse(
      res,
      200,
      true,
      productCart,
      null,
      null,
      "Soft-deleted cart item successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = cartControllers;

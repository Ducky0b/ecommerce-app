const Cart = require("../models/Cart");
const ProductCart = require("../models/ProductCart");
const User = require("../models/User");
const Order = require("../models/Order");
const ProductOrder = require("../models/ProductOrder");
const { AppError, sendResponse } = require("../helpers/utils");

const orderControllers = {};

orderControllers.createOrder = async (req, res, next) => {
  try {
    const { userId } = req;

    const cart = await Cart.findOne({ userId, isDeleted: false });

    if (!cart) throw new AppError(404, "Cart not found", "Create order error");

    const productCarts = await ProductCart.find({
      cartId: cart._id,
      isDeleted: false,
    }).populate("productId");

    if (productCarts.length === 0) {
      throw new AppError(400, "Cart is empty", "Create order error");
    }

    for (let item of productCarts) {
      const product = item.productId;
      if (!product || product.isDeleted) {
        throw new AppError(404, "Product not found", "Create order error");
      }
      const variant = product.variants.find(
        (variant) => variant.color === item.color
      );
      if (!variant) throw new AppError(404, "Color not found");
      const sizeEntry = variant.sizes.find(
        (variant) => variant.size === item.size
      );
      if (!sizeEntry || item.quantity > sizeEntry.stock) {
        throw new AppError(
          400,
          `Not enough stock for ${product.name} (${item.color}/${item.size})`
        );
      }
    }
    let totalAmount = 0;
    let totalProduct = 0;
    const order = await Order.create({ userId, totalAmount, totalProduct });
    const productOrders = [];

    for (let item of productCarts) {
      const product = item.productId;
      const variant = product.variants.find((v) => v.color === item.color);
      if (!variant) throw new AppError(404, "Color not found");

      const sizeEntry = variant.sizes.find((s) => s.size === item.size);
      if (!sizeEntry) throw new AppError(404, "Size not found (again)");

      sizeEntry.stock -= item.quantity;
      await product.save();

      const productOrder = await ProductOrder.create({
        orderId: order._id,
        productId: product._id,
        quantity: item.quantity,
        price: product.price * item.quantity,
        color: item.color,
        size: item.size,
      });

      productOrders.push(productOrder);
      order.totalAmount += item.quantity * product.price;
      order.totalProduct += item.quantity;
      await order.save();
    }

    for (let item of productCarts) {
      item.isDeleted = true;
      await item.save();
    }

    cart.itemCount = 0;
    await cart.save();

    // 🔥 cập nhật totalSpent và totalOrders cho user
    const userOrders = await Order.find({ userId, isDeleted: false });
    const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = userOrders.length;

    await User.findByIdAndUpdate(userId, { totalSpent, totalOrders });
    sendResponse(
      res,
      201,
      true,
      order,
      productOrders,
      null,
      "Order created successfully"
    );
  } catch (error) {
    next(error);
  }
};
orderControllers.getCurrentUserOrder = async (req, res, next) => {
  try {
    const { userId } = req;

    let orders = await Order.find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders.length) {
      return sendResponse(res, 200, true, [], null, null, "No orders found");
    }

    const orderIds = orders.map((o) => o._id);

    const productOrders = await ProductOrder.find({
      orderId: { $in: orderIds },
    })
      .populate({
        path: "productId",
        select: "name price thumbnail variants category",
      })
      .lean();

    const orderMap = {};
    for (let order of orders) {
      orderMap[order._id] = { ...order, items: [] };
    }

    for (let item of productOrders) {
      if (orderMap[item.orderId]) {
        orderMap[item.orderId].items.push(item);
      }
    }

    const result = Object.values(orderMap);

    sendResponse(
      res,
      200,
      true,
      result,
      null,
      null,
      "Fetched user orders successfully"
    );
  } catch (error) {
    next(error);
  }
};
orderControllers.getAllOrders = async (req, res, next) => {
  try {
    let { page, limit, ...filter } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Đếm tổng số orders
    const count = await Order.countDocuments({ isDeleted: false });
    const totalPage = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const orders = await Order.find({ isDeleted: false })
      .populate("userId")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    if (!orders.length) {
      return sendResponse(res, 200, true, [], null, null, "No orders found");
    }
    const orderIds = orders.map((o) => o._id);
    const productOrders = await ProductOrder.find({
      orderId: { $in: orderIds },
    })
      .populate({
        path: "productId",
        select: "name price thumbnail variants category",
      })
      .lean();
    const orderMap = {};
    for (let order of orders) {
      orderMap[order._id] = { ...order, items: [] };
    }
    for (let item of productOrders) {
      if (orderMap[item.orderId]) {
        orderMap[item.orderId].items.push(item);
      }
    }
    const result = Object.values(orderMap);

    sendResponse(
      res,
      200,
      true,
      result,
      { totalPage, count },
      null,
      "Fetched all orders successfully"
    );
  } catch (error) {
    next(error);
  }
};
orderControllers.updateStatusOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let order = await Order.findOne({ _id: id, isDeleted: false }).populate(
      "userId"
    );
    if (!order) {
      throw new AppError(404, "Order not found", "Update order error");
    }

    const allowedFields = ["status"];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        order[field] = updates[field];
      }
    });

    await order.save();

    sendResponse(
      res,
      200,
      true,
      order,
      null,
      null,
      "Order updated successfully"
    );
  } catch (error) {
    next(error);
  }
};
orderControllers.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = await Order.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!order)
      throw new AppError(400, "Order not found", "Delete order error");

    sendResponse(
      res,
      200,
      true,
      order,
      null,
      null,
      "Deleted order successfully"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = orderControllers;

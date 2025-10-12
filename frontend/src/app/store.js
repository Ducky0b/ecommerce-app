import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import productsReducer from "../features/product/productSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import categoryReducer from "../features/category/categorySlice";
const rootReducer = {
  user: userReducer,
  products: productsReducer,
  cart: cartReducer,
  order: orderReducer,
  category: categoryReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;

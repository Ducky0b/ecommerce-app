import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  cartItems: [],
  totalQuantity: 0,
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { data, extra } = action.payload;
      state.cartItems = data || [];
      state.totalQuantity = extra || 0;
    },
    clearCart(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.error = null;
    },
  },
});

export const getCart = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/cart/${id}`);

    dispatch(slice.actions.getCartSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const addToCart =
  ({ userId, productId, color, size, quantity }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await apiService.post(`/cart`, {
        productId,
        color,
        size,
        quantity,
      });
      await dispatch(getCart(userId));

      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const updateCartItemQuantity =
  ({ userId, itemId, quantity }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await apiService.put(`/cart/${itemId}`, { quantity });
      await dispatch(getCart(userId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const removeCartItem =
  ({ userId, itemId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await apiService.delete(`/cart/${itemId}`);
      await dispatch(getCart(userId));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const { clearCart } = slice.actions;

export default slice.reducer;

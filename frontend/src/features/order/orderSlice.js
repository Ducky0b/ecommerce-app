import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { clearCart } from "../cart/cartSlice";
const initialState = {
  isLoading: false,
  error: null,
  orders: [],
  currentOrder: [],
  currentPage: 1,
  totalPagesOrders: 0,
  totalOrders: 0,
};

const slice = createSlice({
  name: "order",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createOrderSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const newOrder = action.payload.data;
      state.orders = [newOrder, ...state.orders];
    },
    getCurrentOrderSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const newCurrentOrder = action.payload.data;

      state.currentOrder = newCurrentOrder;
    },
    getAllOrdersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { data } = action.payload;

      state.orders = data;
    },
    updateStatusOrderSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const updatedStatus = action.payload.data;

      const index = state.orders.findIndex((p) => p._id === updatedStatus._id);
      if (index !== -1) {
        state.orders[index] = updatedStatus;
      }
    },
    deleteOrderSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const deletedOrder = action.payload.data;
      state.orders = state.orders.filter(
        (order) => order._id !== deletedOrder._id
      );
    },
  },
});
export const createOrder = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.post(`/orders`);
    dispatch(slice.actions.createOrderSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};
export const getCurrentOrders = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/orders/me`);
    dispatch(slice.actions.getCurrentOrderSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};
export const getAllOrders = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/orders`);
    dispatch(slice.actions.getAllOrdersSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};
export const updateStatusOrder =
  ({ id, status }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.put(`/orders/${id}/status`, { status });
      dispatch(slice.actions.updateStatusOrderSuccess(response.data));
      toast.success("Chỉnh sửa trạng thái thành công");
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };
export const deleteOrder = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/orders/${id}`);
    dispatch(slice.actions.deleteOrderSuccess(response.data));
    toast.success("Xoá đơn hàng thành công");
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};
export default slice.reducer;

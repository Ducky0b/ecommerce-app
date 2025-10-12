import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import { cloudinaryUpload } from "../../utils/cloudinary";
const initialState = {
  isLoading: false,
  error: null,
  users: [],
  totalPagesUsers: 0,
  currentPageUsers: 1,
  countUsers: 0,
  currentUser: [],
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getCurrentUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.currentUser = action.payload.data;
    },
    getAllUsersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const {
        data,
        extra: { totalPage, count },
        page,
      } = action.payload;

      state.users = data;
      state.totalPagesUsers = totalPage;
      state.count = count;
      state.currentPageUsers = page;
    },
    updateUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const updatedUser = action.payload.data;

      if (Array.isArray(state.currentUser)) {
        const index = state.currentUser.findIndex(
          (user) => user._id === updatedUser._id
        );

        if (index !== -1) {
          state.currentUser[index] = updatedUser;
        }
      } else {
        state.currentUser = updatedUser;
      }
    },
    deleteUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const deletedUser = action.payload.data;

      state.users = state.users.filter((u) => u._id !== deletedUser._id);
    },
  },
});

export const getCurrentUser = () => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.get(`/users/me`);
    dispatch(slice.actions.getCurrentUserSuccess(response.data));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export const getAllUsers =
  ({ page, limit = 10 }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/users`, { params });
      dispatch(slice.actions.getAllUsersSuccess({ ...response.data, page }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const updateUser =
  ({ id, name, phone, avatarUrl, email, address, city, ward, district }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        name,
        phone,
        email,
        address,
        city,
        ward,
        district,
      };
      if (avatarUrl instanceof File) {
        const imageUrl = await cloudinaryUpload(avatarUrl);
        data.avatarUrl = imageUrl;
      }
      const response = await apiService.put(`/users/${id}`, data);
      dispatch(slice.actions.updateUserSuccess(response.data));
      toast.success("Chỉnh sửa thành công");
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      toast.error(error.message);
    }
  };

export const deleteUser = (id) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.delete(`/users/${id}`);
    dispatch(slice.actions.deleteUserSuccess(response.data));
    toast.success("Xoá tài khoản thành công");
  } catch (error) {
    dispatch(slice.actions.hasError(error));
    toast.error(error.message);
  }
};

export default slice.reducer;
